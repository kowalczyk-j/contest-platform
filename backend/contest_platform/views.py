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
)
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.core.mail import send_mail
from .utils.import_schools_csv import upload_schools_data

from rest_framework.decorators import api_view
from datetime import date
from rest_framework.permissions import AllowAny


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
        total_max_rating = GradeCriterion.objects.filter(
            contest=contest
        ).aggregate(Sum("max_rating"))["max_rating__sum"]
        return Response({"total_max_rating": total_max_rating or 0})

    @action(detail=True, methods=["post"])
    def send_email(self, request, pk=None):
        subject = request.data.get("subject")
        message = request.data.get("message")
        receivers = [
            receiver["email"] for receiver in request.data.get("receivers")
        ]

        send_mail(
            subject,
            message,
            "konkursy.bowarto@gmail.com",  # Adres e-mail nadawcy
            receivers,
            fail_silently=False,
        )

        return Response({"status": "success"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def current_contests(self, request):
        queryset = Contest.objects.filter(date_start__lte=date.today()
                                          ).filter(date_end__gte=date.today())

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PersonViewSet(ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class EntryViewSet(ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

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

    def get_queryset(self):
        queryset = Grade.objects.all()
        entry_id = self.request.query_params.get("entry", None)
        if entry_id is not None:
            queryset = queryset.filter(entry=entry_id)
        return queryset


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
        emails = User.objects.values("email")[:500]
        return Response(emails)


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
