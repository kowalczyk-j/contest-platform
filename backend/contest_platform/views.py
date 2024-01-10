from rest_framework import status
from rest_framework.response import Response
from .models import Address, AssessmentCriterion, Contest, Entry, User
from .serializers import (AddressSerializer, AssessmentCriterionSerializer,
                          ContestSerializer, EntrySerializer, UserSerializer)
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import (api_view, action)
from rest_framework.authentication import TokenAuthentication
from .permissions import UserPermission, ContestPermission
from django.db.models import Sum


@api_view(["POST",])
def logout(request):
    if request.method == "POST":
        request.user.auth_token.delete()
        return Response({"message": "user has been logged out"}, status=status.HTTP_200_OK)


class ContestViewSet(ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [ContestPermission]

    @action(detail=True, methods=['get'])
    def max_rating_sum(self, request, pk=None):
        """
        Returns the sum of max_rating for all AssessmentCriteria related to the contest.
        """
        contest = self.get_object()
        total_max_rating = AssessmentCriterion.objects.filter(
            contest=contest).aggregate(Sum('max_rating'))['max_rating__sum']
        return Response({'total_max_rating': total_max_rating or 0})


class EntryViewSet(ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [EntryPermission]
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
