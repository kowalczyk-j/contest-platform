from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ContestViewSet


contest_router = DefaultRouter()
contest_router.register(r"contests", ContestViewSet)
