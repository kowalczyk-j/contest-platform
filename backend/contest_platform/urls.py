from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AddressViewSet, GradeCriterionViewSet, ContestViewSet, EntryViewSet, PersonViewSet, GradeViewSet
from django.urls import include, path

router = DefaultRouter()
router.register(r"contests", ContestViewSet)
router.register(r"entries", EntryViewSet)
router.register(r"addresses", AddressViewSet)
router.register(r"criterions", GradeCriterionViewSet)
router.register(r"grades", GradeViewSet)
router.register(r"users", UserViewSet),
router.register(r"person", PersonViewSet)
