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
    SchoolPermission
)
from .tasks import send_email_task
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.core.mail import send_mail
from .csv_import.import_schools_csv import upload_schools_data

from rest_framework.decorators import api_view
from datetime import date


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
        receivers = [
            receiver["email"] for receiver in request.data.get("receivers")
        ]  # Selected mailing list passed in form

        send_email_task(
            subject,
            message,
            receivers,
        )

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

