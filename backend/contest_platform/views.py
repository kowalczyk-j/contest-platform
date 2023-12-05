from rest_framework import viewsets
from rest_framework.response import Response
from .models import Contest
from .serializer import ContestSerializer


class ContestViewSet(viewsets.ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer