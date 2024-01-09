from rest_framework import status
from rest_framework.response import Response
from .models import Address, AssessmentCriterion, Contest, Entry, User, Person
from .serializers import (AddressSerializer, AssessmentCriterionSerializer,
                          ContestSerializer, EntrySerializer, UserSerializer,
                          PersonSerializer)
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
                    person = Person.objects.create(**person_serializer.validated_data)
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
