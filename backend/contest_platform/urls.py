from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ContestViewSet, AccountViewSet


contest_router = DefaultRouter()
contest_router.register(r"contests", ContestViewSet)

account_router = DefaultRouter()
account_router.register(r"accounts", AccountViewSet)
