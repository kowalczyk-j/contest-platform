from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Contest
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .serializer import ContestSerializer, UserSerializer
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication


class ContestViewSet(viewsets.ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [permissions.IsAuthenticated]

    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAdminUser])
    def register(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(methods=['post'], detail=False, permission_classes=[permissions.AllowAny])
    def login(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.data['username']
        password = serializer.data['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            # You can customize the response data as needed
            return Response(serializer.data, status=status.HTTP_200_OK)

        self.retrieve()

        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
