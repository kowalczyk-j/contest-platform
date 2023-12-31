from rest_framework.viewsets import ModelViewSet
from .models import Contest, User
from .serializers import ContestSerializer, UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from .permissions import UserPermission, ContestPermission


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


class UserViewSet(ModelViewSet):

    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [UserPermission]
