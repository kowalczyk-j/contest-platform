from django.test import TestCase
from contest_platform.models import User
from django.contrib.auth.models import AnonymousUser
from rest_framework.test import APIRequestFactory, force_authenticate
from contest_platform.models import (
    Contest,
    Entry,
    GradeCriterion,
    Grade,
)
from contest_platform.permissions import GradePermissions
from contest_platform.views import GradeViewSet
from rest_framework.authtoken.models import Token


class GradePermissionsTest(TestCase):
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
        self.grade = Grade.objects.create(
            entry=self.entry, criterion=self.grade_criterion, value=90
        )

    def test_has_permission_list_action_authenticated_staff(self):
        request = self.factory.get("/api/grades/")
        request.user = self.user
        user = self.user
        user.is_staff = True
        force_authenticate(request, user=user)
        view = GradeViewSet()
        view.action = "list"
        permission = GradePermissions()

        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_list_action_authenticated_jury(self):
        request = self.factory.get("/api/grades/")
        request.user = self.user
        user = self.user
        user.is_jury = True
        force_authenticate(request, user=user)
        view = GradeViewSet()
        view.action = "list"
        permission = GradePermissions()

        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_list_action_unauthenticated(self):
        request = self.factory.get("/api/grades/")
        request.user = AnonymousUser()
        view = GradeViewSet()
        view.action = "list"
        permission = GradePermissions()

        self.assertFalse(permission.has_permission(request, view))

    def test_has_permission_create_action_authenticated_staff(self):
        request = self.factory.post(
            "/api/grades/",
            {
                "entry": self.entry.id,
                "criterion": self.grade_criterion.id,
                "value": 90,
            },
        )
        request.user = self.user
        user = self.user
        user.is_staff = True
        force_authenticate(request, user=user)
        view = GradeViewSet()
        view.action = "create"
        permission = GradePermissions()

        self.assertTrue(permission.has_permission(request, view))

    def test_has_object_permission_retrieve_action_authenticated_staff(
        self,
    ):
        request = self.factory.get(f"/api/grades/{self.grade.id}/")
        request.user = self.user
        user = self.user
        user.is_staff = True
        force_authenticate(request, user=user)
        view = GradeViewSet()
        view.action = "retrieve"
        permission = GradePermissions()

        self.assertTrue(permission.has_object_permission(request, view, self.grade))

    def test_has_object_permission_retrieve_action_authenticated_jury(
        self,
    ):
        request = self.factory.get(f"/api/grades/{self.grade.id}/")
        request.user = self.user
        user = self.user
        user.is_jury = True
        force_authenticate(request, user=user)
        view = GradeViewSet()
        view.action = "retrieve"
        permission = GradePermissions()

        self.assertTrue(permission.has_object_permission(request, view, self.grade))

    def test_has_object_permission_retrieve_action_authenticated_entry_user(
        self,
    ):
        request = self.factory.get(f"/api/grades/{self.grade.id}/")
        request.user = self.user
        view = GradeViewSet()
        view.action = "retrieve"
        permission = GradePermissions()

        self.assertTrue(permission.has_object_permission(request, view, self.grade))

    def test_has_object_permission_retrieve_action_unauthenticated(
        self,
    ):
        request = self.factory.get(f"/api/grades/{self.grade.id}/")
        jury_user = User.objects.create_user(
            username="testjury",
            password="testjurypasswd",
            is_jury=False,
        )
        request.user = jury_user
        view = GradeViewSet()
        view.action = "retrieve"
        permission = GradePermissions()

        self.assertFalse(permission.has_object_permission(request, view, self.grade))

    def test_has_object_permission_update_action_authenticated_staff(
        self,
    ):
        request = self.factory.patch(f"/api/grades/{self.grade.id}/", {"value": 95})
        request.user = self.user
        user = self.user
        user.is_staff = True
        force_authenticate(request, user=user)
        view = GradeViewSet()
        view.action = "update"
        permission = GradePermissions()

        self.assertTrue(permission.has_object_permission(request, view, self.grade))

    def test_has_object_permission_update_action_authenticated_jury(
        self,
    ):
        request = self.factory.patch(f"/api/grades/{self.grade.id}/", {"value": 95})
        request.user = self.user
        user = self.user
        user.is_jury = True
        force_authenticate(request, user=user)
        view = GradeViewSet()
        view.action = "update"
        permission = GradePermissions()

        self.assertTrue(permission.has_object_permission(request, view, self.grade))

    def test_has_object_permission_update_action_authenticated_entry_user(
        self,
    ):
        request = self.factory.patch(f"/api/grades/{self.grade.id}/", {"value": 95})
        request.user = self.user
        view = GradeViewSet()
        view.action = "update"
        permission = GradePermissions()
        # Add assertions here

    # Additional test cases for other actions can be added similarly
