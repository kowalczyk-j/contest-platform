from rest_framework import status
from rest_framework.response import Response
from .models import Address, AssessmentCriterion, Contest, Entry, User
from .serializers import (AddressSerializer, AssessmentCriterionSerializer,
                          ContestSerializer, EntrySerializer, UserSerializer)
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from rest_framework.authentication import TokenAuthentication
from .permissions import UserPermission, ContestPermission, EntryPermission
from rest_framework.decorators import action
from django.contrib.auth import authenticate


@api_view(["POST",])
def logout(request):
    if request.method == "POST":
        request.user.auth_token.delete()
        return Response({"message": "user has been logged out"}, status=status.HTTP_200_OK)


class ContestViewSet(ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [ContestPermission]


class EntryViewSet(ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [EntryPermission]
    # TODO

    def get_queryset(self):
        queryset = Entry.objects.all()
        contest_id = self.request.query_params.get('contest', None)
        if contest_id is not None:
            queryset = queryset.filter(contest=contest_id)
        return queryset


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

    @action(detail=False, methods=['get'])
    def current_user(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
