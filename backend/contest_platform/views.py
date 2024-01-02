from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Address, AssessmentCriterion, Contest, Entry
from .serializer import (AddressSerializer, AssessmentCriterionSerializer,
                         ContestSerializer, EntrySerializer)


class ContestViewSet(viewsets.ModelViewSet):
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        return self.get_queryset().get(pk=self.kwargs["pk"])


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        queryset = Entry.objects.all()
        contest_id = self.request.query_params.get('contest', None)
        if contest_id is not None:
            queryset = queryset.filter(contest=contest_id)
        return queryset


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AssessmentCriterionViewSet(viewsets.ModelViewSet):
    queryset = AssessmentCriterion.objects.all()
    serializer_class = AssessmentCriterionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
