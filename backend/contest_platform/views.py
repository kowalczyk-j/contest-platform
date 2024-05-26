from rest_framework import status
from rest_framework.response import Response
from .models import (
    Address,
    GradeCriterion,
    Contest,
    Entry,
    User,
    Person,
    Grade,
    School,
)
from .serializers import (
    AddressSerializer,
    GradeCriterionSerializer,
    ContestSerializer,
    EntrySerializer,
    UserSerializer,
    PersonSerializer,
    GradeSerializer,
    SchoolSerializer,
)
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import TokenAuthentication
from .permissions import (
    UserPermission,
    ContestPermission,
    EntryPermission,
    GradeCriterionPermissions,
    GradePermissions,
    SchoolPermission
)
from .tasks import send_email_task, send_certificate_task
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.conf import settings
from .csv_import.import_schools_csv import upload_schools_data
from rest_framework.decorators import api_view
from datetime import date, timedelta
from django.http import HttpResponse
from weasyprint import HTML
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404


class Logout(GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        request.user.auth_token.delete()
        return Response(
            {"message": "user has been logged out"}, status=status.HTTP_200_OK
        )


class ContestViewSet(ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [ContestPermission]
    certificate_template_path = 'certificate.html'
    default_achievement = "za udział"

    @action(detail=True, methods=["get"])
    def max_rating_sum(self, request, pk=None):
        """
        Returns the sum of max_rating for all GradeCriteria
        related to the contest.
        """
        contest = self.get_object()
        total_max_rating = GradeCriterion.objects.filter(
            contest=contest).aggregate(
            Sum("max_rating")
        )["max_rating__sum"]
        return Response({"total_max_rating": total_max_rating or 0})

    def generate_pdf(self, data):
        html_string = render_to_string(self.certificate_template_path, data)
        html = HTML(string=html_string)
        pdf = html.write_pdf()
        return pdf

    @action(detail=True, methods=['post'], url_path='send_certificates')
    def send_certificates(self, request, pk=None):
        if pk is None:
            return Response(
                {"error": "No contest id given"},
                status=status.HTTP_400_BAD_REQUEST
            )
        contest = get_object_or_404(Contest, pk=pk)
        entries = Entry.objects.filter(contest_id=contest.id)
        signatory = request.data.get('signatory', '')
        signature = request.data.get('signature', '')
        user_details = entries.values_list(
            'user__first_name',
            'user__last_name',
            'user__email'
        ).distinct()

        for first_name, last_name, email in user_details:
            pdf = self.generate_pdf(
                data={
                    'participant': f"{first_name} {last_name}",
                    'achievement': self.default_achievement,
                    'email': email,
                    'signatory': signatory,
                    'signature': signature,
                    'contest': contest.description,
                }
            )

            subject = "Twój certyfikat"
            message = "Dziękujemy za udział!."
            send_certificate_task(
                subject,
                message,
                first_name,
                last_name,
                email,
                pdf
            )

        return Response({"status": "certificates sent"})

    @action(detail=False, methods=["get"], url_path='certificate')
    def generate_certificate(self, request):
        participant = request.query_params.get("participant", None)
        achievement = request.query_params.get("achievement", None)
        signature = request.query_params.get("signature", None)
        signatory = request.query_params.get("signatory", None)
        contest = request.query_params.get("contest", None)
        if not all([participant,  achievement, signature, signatory, contest]):
            errormsg = "All parameters (participant, achievement, "
            errormsg += "signature, signatory) are required."
            return Response(
                {"error": errormsg},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            "participant": participant,
            "achievement": achievement,
            "signature": signature,
            "signatory": signatory,
            "contest": contest
        }

        try:
            pdf = self.generate_pdf(data)
        except Exception as e:
            errormsg = "Exception while rendering"
            errormsg += " certificate. Conntact administrator: " + e
            return Response(
                {"error": errormsg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="diploma.pdf"'
        return HttpResponse(pdf, content_type='application/pdf')

    # REQ_17
    @action(detail=False, methods=["post"])
    def send_email(self, request, pk=None):
        subject = request.data.get("subject")
        message = request.data.get("message")
        host_email = settings.EMAIL_HOST_USER

        # Create message list for send_mass_mail as specified in the documentation for send_mass_mail
        messages = [
            (subject, message, host_email, [receiver["email"]])
            for receiver in request.data.get("receivers")
        ]

        send_email_task.send(messages)

        return Response({"status": "success"}, status=status.HTTP_200_OK)

    # REQ_17_END

    @action(detail=False, methods=["get"])
    def current_contests(self, request):
        """
        Returns only contests that are after their start date but before end
        date.
        """
        queryset = Contest.objects.filter(date_start__lte=date.today()).filter(
            date_end__gte=date.today()
        )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'], url_path='delete_with_related')
    def delete_with_related(self, request, pk=None):
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
    def get_contestants_amount(self, request, pk=None):
        """
        Returns all contestants for the current contest.
        """
        contest = self.get_object()
        entries = Entry.objects.filter(contest=contest)
        total_contestants = sum(entry.contestants.all().count() for entry in entries)
        return Response(
            {"contestant_amount": total_contestants}, status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["get"])
    def get_entry_amount(self, request, pk=None):
        contest = self.get_object()
        entry_amount = Entry.objects.filter(contest=contest).count()
        return Response({"entry_amount": entry_amount})

    @action(detail=True, methods=["get"])
    def group_individual_comp(self, request, pk=None):
        """
        Returns plot data to compare the amount of group and individual submissions
        """
        contest = self.get_object()
        entries = Entry.objects.filter(contest=contest).annotate(
            num_contestants=Count("contestants")
        )
        group_entries = entries.filter(num_contestants__gt=1).count()
        solo_entries = entries.count() - group_entries

        return Response({"solo_entries": solo_entries, "group_entries": group_entries}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def get_submissions_by_day(self, request, pk=None):
        """
        Returns data for the amount of submissions on each day of contest
        """
        contest = self.get_object()

        def generate_date_range(start_date, end_date): # possibly move to separate utilities
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
        daily_entries_dict = {entry["date_submitted"]: entry["entry_count"] for entry in daily_entries}

        all_daily_entries = []
        for date in generate_date_range(start_date, end_date):
            all_daily_entries.append({"date_submitted": date, "entry_count": daily_entries_dict.get(date, 0)})

        return Response({"daily_entries": all_daily_entries}, status=status.HTTP_200_OK)

    # Endpoints:
    # total submissions - exists already probably


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


class AddressViewSet(ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [AddressPermission]
    # TODO


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
        contest_id = request.query_params.get('contestId', None)
        if contest_id is None:
            return Response({'error': 'contestId parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            contest_id = int(contest_id)
        except ValueError:
            return Response({'error': 'contestId must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)

        queryset_criterion = GradeCriterion.objects.filter(user=user, contest=contest_id)
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

    @action(detail=False, methods=["get"])
    def current_user(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def emails(self, request):
        """
        Returns a list of first 500 emails in the databaser.
        500 is max SMTP gmail daily limit.
        """
        emails = User.objects.values("email")[:500]
        return Response(emails)

    @action(detail=False, methods=["get"])
    def emails_subscribed(self, request):
        """
        Returns a list of first 500 emails in the database - subscribed to the newsletter.
        500 is max SMTP gmail daily limit.
        """
        emails = User.objects.filter(is_newsletter_subscribed=True).values("email")[:500]
        return Response(emails)

    @action(detail=False, methods=["get"])
    def jury_users(self, request):
        jury_users = self.queryset.filter(is_jury=True)
        serializer = self.get_serializer(jury_users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["put"], url_path='update-profile')
    def update_profile(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["post"], url_path='change_password')
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not user.check_password(old_password):
            return Response({'detail': 'Obecne hasło jest nieprawidłowe'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 5:
            return Response({'detail': 'Nowe hasło musi mieć co najmniej 5 znaków'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Pomyślnie zmieniono hasło'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["delete"], url_path='delete_account')
    def delete_account(self, request, pk=None):
        user = self.get_object()
        if user.is_superuser:
            return Response({'detail': 'Nie można usunąć konta administratora.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Delete grades to user entries
        user_entries = Entry.objects.filter(user=user)
        Grade.objects.filter(entry__in=user_entries).delete()
        
        # Delete entries
        user_entries.delete()

        # If it was a jury then assign its ratings to the main administrator
        default_user = User.objects.get(pk=1)
        GradeCriterion.objects.filter(user=user).update(user=default_user)
        
        user.delete()

        return Response({'detail': 'Konto zostało pomyślnie usunięte.'}, status=status.HTTP_204_NO_CONTENT)
# REQ_06B_END


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
            {"message": "Upload successful"}, status=status.HTTP_201_CREATED
        )
    else:
        return Response(
            {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
        )
