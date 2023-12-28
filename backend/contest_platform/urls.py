from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (AddressViewSet, AssessmentCriterionViewSet, ContestViewSet,
                    EntryViewSet)

contest_router = DefaultRouter()
contest_router.register(r"contests", ContestViewSet)
contest_router.register(r"entries", EntryViewSet)
contest_router.register(r"addresses", AddressViewSet)
contest_router.register(r"assessment-criterion", AssessmentCriterionViewSet)
