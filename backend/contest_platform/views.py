from rest_framework import status
from rest_framework.response import Response
from .models import Address, GradeCriterion, Contest, Entry, User, Person, Grade
from .serializers import (
    AddressSerializer,
    GradeCriterionSerializer,
    ContestSerializer,
    EntrySerializer,
    UserSerializer,
    PersonSerializer,
    GradeSerializer
)
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import TokenAuthentication
from .permissions import UserPermission, ContestPermission, EntryPermission, GradeCriterionPermissions, GradePermissions
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
        Returns the sum of max_rating for all GradeCriteria related to the contest.
        """
        contest = self.get_object()
        total_max_rating = GradeCriterion.objects.filter(
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

    def get_queryset(self):
        queryset = Entry.objects.all()
        contest_id = self.request.query_params.get("contest", None)
        if contest_id is not None:
            queryset = queryset.filter(contest=contest_id)
        return queryset

    # def get_queryset(self):
    #     user_param = self.request.query_params.get('user', None)
    #     contest_param = self.request.query_params.get('contest', None)

    #     if user_param:
    #         return Entry.objects.filter(user=user_param)
    #     if contest_param:
    #         return Entry.objects.filter(contest=contest_param)
    #     return self.get_queryset()


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
    permission_classes = [GradeCriterionPermissions]


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
