from datetime import date, timedelta
from django.conf import settings
from django.core.cache import cache
from django.db.models import Count, Sum, Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action, api_view
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from weasyprint import HTML
from .csv_import.import_schools_csv import upload_schools_data
from .models import Contest, Entry, Grade, GradeCriterion, Person, School, User
from .permissions import (
    ContestPermission,
    EntryPermission,
    GradeCriterionPermissions,
    GradePermissions,
    SchoolPermission,
    UserPermission,
)
from .serializers import (
    ContestSerializer,
    EntrySerializer,
    GradeCriterionSerializer,
    GradeSerializer,
    PersonSerializer,
    SchoolSerializer,
    UserSerializer,
)
from .tasks import send_certificates_task, send_email_task


# low values set for testing
def cache_short_lived(key, value):
    cache.set(key, value, timeout=30)


def cache_long_lived(key, value):
    cache.set(key, value, timeout=90)


class Logout(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        request.user.auth_token.delete()
        return Response(
            {"message": "Wylogowano użytkownika."}, status=status.HTTP_200_OK
        )


class ContestViewSet(ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [ContestPermission]
    certificate_template_path = "certificate.html"
    default_achievement = "za udział"

    @action(detail=True, methods=["get"])
    def max_rating_sum(self, request, pk):
        """
        Returns the sum of max_rating for all GradeCriteria
        related to the contest.
        """
        key = f"max_rating_sum_{pk}"
        stored_sum = cache.get(key)
        if stored_sum:
            return Response({"total_max_rating": stored_sum or 0})
        contest = self.get_object()
        total_max_rating = GradeCriterion.objects.filter(contest=contest).aggregate(
            Sum("max_rating")
        )["max_rating__sum"]
        cache_long_lived(key, total_max_rating)
        return Response({"total_max_rating": total_max_rating or 0})

    def generate_pdf(self, data):
        html_string = render_to_string(self.certificate_template_path, data)
        html = HTML(string=html_string)
        pdf = html.write_pdf()
        return pdf

    @action(detail=True, methods=["post"])
    def send_certificates(self, request, pk=None):
        if pk is None:
            return Response(
                {"error": "Nie podano id konkursu."}, status=status.HTTP_400_BAD_REQUEST
            )
        contest = get_object_or_404(Contest, pk=pk)
        entries = Entry.objects.filter(contest_id=contest.id)
        signatory = request.data.get("signatory", "")
        signature = request.data.get("signature", "")
        user_details = entries.values_list(
            "user__first_name", "user__last_name", "user__email"
        ).distinct()
        send_certificates_task(
            user_details,
            signatory,
            signature,
            contest.title,
            self.default_achievement,
            self.certificate_template_path,
        )

        return Response({"status": "certificates sent"})

    @action(detail=False, methods=["get"], url_path="certificate")
    def generate_certificate(self, request):
        participant = request.query_params.get("participant", None)
        achievement = request.query_params.get("achievement", None)
        signature = request.query_params.get("signature", None)
        signatory = request.query_params.get("signatory", None)
        contest = request.query_params.get("contest", None)
        if not all([participant, achievement, signature, signatory, contest]):
            return Response(
                {
                    "error": "Wszystkie parametry (uczestnik, osiągnięcie, \
                          podpis, podpisujący) są wymagane."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = {
            "participant": participant,
            "achievement": achievement,
            "signature": signature,
            "signatory": signatory,
            "contest": contest,
        }

        try:
            pdf = self.generate_pdf(data)
        except Exception as e:
            return Response(
                {
                    "error": f"Wystąpił błąd podczas renderowania certyfikatu. \
                          Skontaktuj się z administratorem. {e}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = 'inline; filename="diploma.pdf"'
        return HttpResponse(pdf, content_type="application/pdf")

    # REQ_17
    @action(detail=False, methods=["post"])
    def send_email(self, request, pk=None):
        subject = request.data.get("subject")
        message = request.data.get("message")
        host_email = settings.EMAIL_HOST_USER

        # Create message list for send_mass_mail
        # as specified in the documentation for send_mass_mail
        messages = [
            (subject, message, host_email, [receiver["email"]])
            for receiver in request.data.get("receivers")
        ]

        send_email_task.send(messages)

        return Response({"status": "success"}, status=status.HTTP_200_OK)

    # REQ_17_END

    @action(detail=True, methods=["delete"])
    def delete_with_related(self, request, pk=None):
        """
        Deletes the competition by first deleting the associated elements
        """
        try:
            contest = self.get_object()
            Grade.objects.filter(entry__contest=contest).delete()
            Entry.objects.filter(contest=contest).delete()
            GradeCriterion.objects.filter(contest=contest).delete()
            contest.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Contest.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["get"])
    def get_contestants_amount(self, request, pk):
        """
        Returns all contestants for the current contest.
        """
        key = f"contestants_amount_{pk}"
        stored = cache.get(key)
        if stored:
            return Response({"contestant_amount": stored}, status=status.HTTP_200_OK)
        contest = self.get_object()
        entries = Entry.objects.filter(contest=contest)
        total_contestants = sum(entry.contestants.all().count() for entry in entries)
        cache_short_lived(key, total_contestants)
        return Response(
            {"contestant_amount": total_contestants}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get"])
    def get_entry_amount(self, request, pk):
        key = f"entry_amount_{pk}"
        stored = cache.get(key)
        if stored:
            return Response({"entry_amount": stored}, status=status.HTTP_200_OK)
        contest = self.get_object()
        entry_amount = Entry.objects.filter(contest=contest).count()
        cache_short_lived(key, entry_amount)
        return Response({"entry_amount": entry_amount})

    @action(detail=True, methods=["get"])
    def group_individual_comp(self, request, pk):
        """
        Returns plot data to compare the
        amount of group and individual submissions
        """
        key = f"group_individual_comp_{pk}"
        stored = cache.get(key)
        if stored:
            solo_entries, group_entries = stored
            return Response(
                {"solo_entries": solo_entries, "group_entries": group_entries},
                status=status.HTTP_200_OK,
            )
        contest = self.get_object()
        entries = Entry.objects.filter(contest=contest).annotate(
            num_contestants=Count("contestants")
        )
        group_entries = entries.filter(num_contestants__gt=1).count()
        solo_entries = entries.count() - group_entries
        cache_long_lived(key, (solo_entries, group_entries))
        return Response(
            {"solo_entries": solo_entries, "group_entries": group_entries},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"])
    def get_submissions_by_day(self, request, pk=None):
        """
        Returns data for the amount of submissions on each day of contest
        """
        contest = self.get_object()

        # possibly move to separate utilities
        def generate_date_range(start_date, end_date):
            current_date = start_date
            while current_date <= end_date:
                yield current_date
                current_date += timedelta(days=1)

        start_date = contest.date_start
        end_date = contest.date_end

        daily_entries = (
            Entry.objects.filter(
                contest=contest,
                date_submitted__gte=contest.date_start,
                date_submitted__lte=contest.date_end,
            )
            .values("date_submitted")
            .annotate(entry_count=Count("id"))
        )
        daily_entries_dict = {
            entry["date_submitted"]: entry["entry_count"] for entry in daily_entries
        }

        all_daily_entries = []
        for day in generate_date_range(start_date, end_date):
            all_daily_entries.append(
                {"date_submitted": day, "entry_count": daily_entries_dict.get(day, 0)}
            )

        return Response({"daily_entries": all_daily_entries}, status=status.HTTP_200_OK)


class PersonViewSet(ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class EntryViewSet(ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [EntryPermission]

    def get_queryset(self):
        queryset = Entry.objects.all()
        contest_id = self.request.query_params.get("contest", None)
        user_id = self.request.query_params.get("user", None)
        if contest_id is not None:
            queryset = queryset.filter(contest=contest_id)
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        return queryset

    @action(detail=True, methods=["get"])
    def total_grade_value(self, request, pk=None):
        total_value = Grade.objects.filter(entry=pk).aggregate(Sum("value"))[
            "value__sum"
        ]
        return Response({"total_value": total_value})

    @action(detail=True, methods=["delete"])
    def delete_with_related(self, request, pk=None):
        """
        Deletes the entry by first deleting the associated grades
        """
        try:
            entry = self.get_object()
            Grade.objects.filter(entry=entry).delete()
            entry.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Entry.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class GradeCriterionViewSet(ModelViewSet):
    queryset = GradeCriterion.objects.all()
    serializer_class = GradeCriterionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [GradeCriterionPermissions]


class GradeViewSet(ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [GradePermissions]

    @action(detail=False, methods=["get"])
    def to_evaluate(self, request):
        user = request.user
        contest_id = request.query_params.get("contestId", None)
        if contest_id is None:
            return Response(
                {"error": "Parametr contestId jest wymagany."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            contest_id = int(contest_id)
        except ValueError:
            return Response(
                {"error": "Parametr contestId musi być liczbą."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset_criterion = GradeCriterion.objects.filter(
            user=user, contest=contest_id
        )
        qs = self.get_queryset().filter(criterion__in=queryset_criterion)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = Grade.objects.all()
        entry_id = self.request.query_params.get("entry", None)
        if entry_id is not None:
            queryset = queryset.filter(entry=entry_id)
        return queryset


# REQ_06B
class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [UserPermission]

    # REQ_06B_END
    @action(detail=False, methods=["get"])
    def current_user(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def emails_subscribed(self, request):
        """
        Returns a list of first 500 emails in the
        database - subscribed to the newsletter.
        500 is max SMTP gmail daily limit.
        """
        emails = User.objects.filter(is_newsletter_subscribed=True).values("email")[
            :500
        ]
        return Response(emails)

    # REQ_15
    @action(detail=False, methods=["get"])
    def jury_users(self, request):
        key = "jury_users"
        jury_users = cache.get(key)
        if not jury_users:
            jury_users = list(User.objects.filter(Q(is_jury=True) | Q(is_staff=True)))
            cache_long_lived(key, jury_users)
        serializer = self.get_serializer(jury_users, many=True)
        return Response(serializer.data)

    # REQ_15_END

    # REQ_07B
    @action(detail=False, methods=["put"])
    def update_profile(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # REQ_07B_END
    @action(detail=False, methods=["post"])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not user.check_password(old_password):
            return Response(
                {"detail": "Obecne hasło jest nieprawidłowe"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(new_password) < 5:
            return Response(
                {"detail": "Nowe hasło musi mieć co najmniej 5 znaków"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save()
        return Response(
            {"detail": "Pomyślnie zmieniono hasło"}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["delete"])
    def delete_account(self, request, pk=None):
        if int(pk) == request.user.id:
            user = request.user
        else:
            if not request.user.is_staff:
                return Response(
                    {"detail": "Nie masz uprawnień do usuwania innych użytkowników."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            user = User.objects.get(pk=pk)

        if user.is_staff:
            return Response(
                {
                    "detail": "Nie można usunąć konta administratora. \
                          Najpierw odbierz mu uprawnienia."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Delete grades to user entries
        user_entries = Entry.objects.filter(user=user)
        Grade.objects.filter(entry__in=user_entries).delete()

        # Delete entries
        user_entries.delete()

        # If it was a jury then assign his ratings to the main administrator
        default_user = User.objects.get(pk=1)
        GradeCriterion.objects.filter(user=user).update(user=default_user)

        user.delete()

        return Response(
            {"detail": "Konto zostało pomyślnie usunięte."},
            status=status.HTTP_204_NO_CONTENT,
        )

    # REQ_08B
    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        user = self.get_object()
        status_type = request.data.get("statusType")

        if user.is_superuser:
            return Response(
                {"detail": "Nie można zmienić statusu głównego administratora."},
                status=status.HTTP_403_FORBIDDEN,
            )

        status_mapping = {
            "admin": {
                "is_staff": True,
                "is_jury": False,
                "is_coordinating_unit": False,
            },
            "jury": {"is_staff": False, "is_jury": True, "is_coordinating_unit": False},
            "coordinating_unit": {
                "is_staff": False,
                "is_jury": False,
                "is_coordinating_unit": True,
            },
            "user": {
                "is_staff": False,
                "is_jury": False,
                "is_coordinating_unit": False,
            },
        }

        if status_type not in status_mapping:
            return Response(
                {"detail": "Wystąpił błąd podczas nadawania uprawnień."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        attributes_to_update = status_mapping[status_type]
        for attribute, value in attributes_to_update.items():
            setattr(user, attribute, value)

        user.save()
        return Response(
            {"detail": f"Pomyślnie zmieniono rodzaj konta na {status_type}."},
            status=status.HTTP_200_OK,
        )


# REQ_08B_END


class SchoolViewSet(ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [SchoolPermission]

    @action(detail=False, methods=["get"])
    def emails(self, request):
        """
        Returns a list of first 500 emails in the database.
        500 is max SMTP gmail daily limit.
        """
        emails = School.objects.values("email")[:500]
        return Response(emails)


@api_view(["POST"])
def import_schools(request):
    if request.method == "POST" and "csv_file" in request.FILES:
        file = request.FILES["csv_file"]
        upload_schools_data(file)
        return Response(
            {"message": "Pomyślnie wczytano."}, status=status.HTTP_201_CREATED
        )
    else:
        return Response(
            {"error": "Nie podano pliku."}, status=status.HTTP_400_BAD_REQUEST
        )
