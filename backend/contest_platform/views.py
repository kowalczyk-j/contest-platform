from rest_framework import status
from rest_framework.response import Response
from .models import Address, AssessmentCriterion, Contest, Entry, User, Person
from .serializers import (
    AddressSerializer,
    AssessmentCriterionSerializer,
    ContestSerializer,
    EntrySerializer,
    UserSerializer,
    PersonSerializer,
)
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import TokenAuthentication
from .permissions import UserPermission, ContestPermission, EntryPermission
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.core.mail import send_mail


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

    @action(detail=True, methods=['get'])
    def max_rating_sum(self, request, pk=None):
        """
        Returns the sum of max_rating for all AssessmentCriteria related to the contest.
        """
        contest = self.get_object()
        total_max_rating = AssessmentCriterion.objects.filter(
            contest=contest).aggregate(Sum('max_rating'))['max_rating__sum']
        return Response({'total_max_rating': total_max_rating or 0})

    @action(detail=True, methods=['post'])
    def send_email(self, request, pk=None):
        subject = request.data.get('subject')
        message = request.data.get('message')

        recipients = ['jakubkow505@gmail.com']
        # TODO : Add recipients from group
        # recipients = User.objects.filter(
        #     groups__name=group_name).values_list('email', flat=True)

        send_mail(
            subject,
            message,
            'konkursy.bowarto@gmail.com',  # Adres e-mail nadawcy
            recipients,
            fail_silently=False,
        )

        return Response({'status': 'success'}, status=status.HTTP_200_OK)


class PersonViewSet(ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class EntryViewSet(ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [EntryPermission]

    def create(self, request, *args, **kwargs):
        entry_data = request.data
        persons_data = entry_data.pop('contestants')
        entry_serializer = self.get_serializer(data=entry_data)
        entry_serializer.is_valid()

        contestants = []
        if 'contestants' in entry_serializer.errors and len(entry_serializer.errors.keys()) == 1:
            for person_data in persons_data:
                person_serializer = PersonSerializer(data=person_data)
                if person_serializer.is_valid():
                    person = Person.objects.create(
                        **person_serializer.validated_data)
                    contestants.append(person.id)

        entry_data['contestants'] = contestants
        entry_serializer = self.get_serializer(data=entry_data)
        if entry_serializer.is_valid():
            self.perform_create(entry_serializer)
            headers = self.get_success_headers(entry_serializer.data)
            return Response(entry_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(entry_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = Entry.objects.all()
        contest_id = self.request.query_params.get("contest", None)
        if contest_id is not None:
            queryset = queryset.filter(contest=contest_id)
        return queryset

    def destroy(self, request, *args, **kwargs):
        entry = self.get_object()
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AddressViewSet(ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [AddressPermission]
    # TODO


class AssessmentCriterionViewSet(ModelViewSet):
    queryset = AssessmentCriterion.objects.all()
    serializer_class = AssessmentCriterionSerializer
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [AssesmentPermission]
    # TODO


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
