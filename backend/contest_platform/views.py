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
from .tasks import send_email_task, send_certificate_task
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .utils.import_schools_csv import upload_schools_data

from rest_framework.decorators import api_view
from datetime import date
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
        qs = [gr for gr in self.queryset if gr.criterion in queryset_criterion]
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
