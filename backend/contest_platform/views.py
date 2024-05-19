from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
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
)
from .tasks import send_email_task
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Case, When
from django.conf import settings
from .utils.import_schools_csv import upload_schools_data

from rest_framework.decorators import api_view
from datetime import date, timedelta


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

    @action(detail=True, methods=["get"])
    def max_rating_sum(self, request, pk=None):
        """
        Returns the sum of max_rating for all GradeCriteria
        related to the contest.
        """
        contest = self.get_object()
        total_max_rating = GradeCriterion.objects.filter(contest=contest).aggregate(
            Sum("max_rating")
        )["max_rating__sum"]
        return Response({"total_max_rating": total_max_rating or 0})

    # REQ_17
    @action(detail=True, methods=["post"])
    def send_email(self, request, pk=None):
        subject = request.data.get("subject")
        message = request.data.get("message")
        host_email = settings.EMAIL_HOST_USER

        # Create message list for send_mass_mail as specified in the documentation for send_mass_mail
        messages = [
            (subject, message, host_email, [receiver["email"]])
            for receiver in request.data.get("receivers")
        ]

        send_email_task(messages)

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
    # total participants - endpoint done
    # comparison between group and individual submissions - endpoint done, chart done
    # total submissions per day
    # get schools(? no school data)


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
        queryset_criterion = GradeCriterion.objects.all().filter(user=user)
        qs = [grade for grade in self.queryset if grade.criterion in queryset_criterion]
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
        Returns a list of first 500 emails in the database.
        500 is max SMTP gmail daily limit.
        """
        emails = User.objects.values("email")[:500]
        return Response(emails)

    @action(detail=False, methods=["get"])
    def jury_users(self, request):
        jury_users = self.queryset.filter(is_jury=True)
        serializer = self.get_serializer(jury_users, many=True)
        return Response(serializer.data)


# REQ_06B_END


class SchoolViewSet(ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer


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
