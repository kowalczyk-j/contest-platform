from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AddressViewSet, AssessmentCriterionViewSet, ContestViewSet, EntryViewSet
from django.urls import include, path

router = DefaultRouter()
router.register(r"contests", ContestViewSet)
router.register(r"entries", EntryViewSet)
router.register(r"addresses", AddressViewSet)
router.register(r"assessment-criterion", AssessmentCriterionViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
