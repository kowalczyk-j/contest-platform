from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from rest_framework.test import APIRequestFactory
from contest_platform.models import (
    User,
    Contest,
    Entry,
    GradeCriterion,
)
from rest_framework.authtoken.models import Token
from rest_framework.test import force_authenticate
from contest_platform.views import EntryViewSet
from contest_platform.permissions import EntryPermission
from rest_framework.request import Request


class EntryPermissionTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.token = Token.objects.create(user=self.user)
        self.contest = Contest.objects.create(title="Test Contest")
        self.entry = Entry.objects.create(user=self.user, contest=self.contest)
        self.grade_criterion = GradeCriterion.objects.create(
            contest=self.contest, max_rating=100
        )

    def test_has_permission_list_action_authenticated_staff(self):
        request = self.factory.get("/api/entries/")
        request.user = self.user
        user = self.user
        user.is_staff = True
        force_authenticate(request, user=user)
        view = EntryViewSet()
        view.action = "list"
        permission = EntryPermission()

        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_list_action_unauthenticated(self):
        request = self.factory.get("/api/entries/")
        request.user = AnonymousUser
        view = EntryViewSet()
        view.action = "list"
        permission = EntryPermission()
        request = Request(request)

        self.assertFalse(permission.has_permission(request, view))

    def test_has_permission_create_action_authenticated_user(self):
        request = self.factory.post("/api/entries/", {"user": self.user.id})
        request.user = self.user
        force_authenticate(request, user=self.user)
        view = EntryViewSet()
        view.action = "create"
        permission = EntryPermission()

        self.assertTrue(permission.has_permission(request, view))

    def test_has_object_permission_retrieve_action_authenticated_user(
        self,
    ):
        request = self.factory.get(f"/api/entries/{self.entry.id}/")
        request.user = self.user
        force_authenticate(request, user=self.user)
        view = EntryViewSet()
        view.action = "retrieve"
        permission = EntryPermission()

        self.assertTrue(permission.has_object_permission(request, view, self.entry))

    def test_has_object_permission_retrieve_action_unauthorized(self):
        request = self.factory.get(f"/api/entries/{self.entry.id}/")
        jury_user = User.objects.create_user(
            username="testjury",
            email="testemail8976@wp.pl",
            password="testjurypasswd",
            is_jury=False,
        )
        request.user = jury_user
        view = EntryViewSet()
        view.action = "retrieve"
        permission = EntryPermission()

        self.assertFalse(permission.has_object_permission(request, view, self.entry))

    def test_has_object_permission_retrieve_action_authorised(self):
        request = self.factory.get(f"/api/entries/{self.entry.id}/")
        jury_user = User.objects.create_user(
            username="test_valid_jury",
            password="testjurypasswd",
            email='testemail43343@wp.pl',
            is_jury=True,
        )
        request.user = jury_user
        view = EntryViewSet()
        view.action = "retrieve"
        permission = EntryPermission()

        self.assertTrue(permission.has_object_permission(request, view, self.entry))
