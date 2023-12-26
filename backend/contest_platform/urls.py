from rest_framework.routers import DefaultRouter
from .views import ContestViewSet, UserViewSet


contest_router = DefaultRouter()
contest_router.register(r"contests", ContestViewSet)

user_router = DefaultRouter()
user_router.register(r"user", UserViewSet)
