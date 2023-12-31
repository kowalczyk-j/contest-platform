from rest_framework.routers import DefaultRouter
from .views import ContestViewSet, UserViewSet
from django.urls import include, path


router = DefaultRouter()
router.register(r"contests", ContestViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
