from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework.authtoken.models import Token
from contest_platform.models import User, Contest, GradeCriterion
from contest_platform.views import ContestViewSet
from contest_platform.permissions import ContestPermission
from rest_framework import status


class ContestPermissionTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.token = Token.objects.create(user=self.user)
        self.contest = Contest.objects.create(title="Test Contest")
        self.grade_criterion = GradeCriterion.objects.create(
            contest=self.contest, max_rating=100
        )

    def test_has_permission_list_action_authenticated_user(self):
        request = self.factory.get("/api/contests/")
        request.user = self.user
        view = ContestViewSet()
        view.action = "list"
        permission = ContestPermission()

        # Authenticated user should have permission to list contests
        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_list_action_unauthenticated(self):
        request = self.factory.get("/api/contests/")
        request.user = AnonymousUser
        view = ContestViewSet()
        view.action = "list"
        permission = ContestPermission()

        # Unauthenticated user should have permission to list contests. Example: new visitors
        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_create_action_authenticated_staff(self):
        request = self.factory.post("/api/contests/", {"title": "New Contest"})
        request.user = self.user
        request.user.is_staff = True
        view = ContestViewSet()
        view.action = "create"
        permission = ContestPermission()

        # Authenticated staff user should have permission to create contests
        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_create_action_authenticated_user(self):
        request = self.factory.post("/api/contests/", {"title": "New Contest"})
        request.user = self.user
        request.user.is_staff = False
        view = ContestViewSet()
        view.action = "create"
        permission = ContestPermission()

        # Authenticated non-staff user should not have permission to create contests
        self.assertFalse(permission.has_permission(request, view))

    def test_has_object_permission_retrieve_action_authenticated_user(
        self,
    ):
        request = self.factory.get(f"/api/contests/{self.contest.id}/")
        request.user = self.user
        view = ContestViewSet()
        view.action = "retrieve"
        permission = ContestPermission()

        # Authenticated user should have permission to retrieve contest details
        self.assertTrue(permission.has_object_permission(request, view, self.contest))

    def test_has_object_permission_retrieve_action_unauthenticated(
        self,
    ):
        request = self.factory.get(f"/api/contests/{self.contest.id}/")
        request.user = AnonymousUser
        view = ContestViewSet()
        view.action = "retrieve"
        permission = ContestPermission()

        # Unauthenticated user should have permission to retrieve contest details
        self.assertTrue(permission.has_object_permission(request, view, self.contest))

    def test_has_object_permission_retrieve_action_staff_user(self):
        request = self.factory.get(f"/api/contests/{self.contest.id}/")
        request.user = self.user
        request.user.is_staff = True
        view = ContestViewSet()
        view.action = "retrieve"
        permission = ContestPermission()

        # Staff user should have permission to retrieve contest details
        self.assertTrue(permission.has_object_permission(request, view, self.contest))

    def test_has_object_permission_retrieve_action_non_staff_user(
        self,
    ):
        request = self.factory.get(f"/api/contests/{self.contest.id}/")
        request.user = self.user
        request.user.is_staff = False
        view = ContestViewSet()
        view.action = "retrieve"
        permission = ContestPermission()

        # Non-staff user should have permission to retrieve contest details
        self.assertTrue(permission.has_object_permission(request, view, self.contest))

    def test_has_object_permission_send_email_action_staff_user(self):
        request = self.factory.post(
            f"/api/contests/{self.contest.id}/send_email/",
            {
                "subject": "Test",
                "message": "Test",
                "receivers": [{"email": "test@example.com"}],
            },
        )
        request.user = self.user
        request.user.is_staff = True
        view = ContestViewSet()
        view.action = "send_email"
        permission = ContestPermission()

        # Staff user should have permission to send emails for contests
        self.assertTrue(permission.has_object_permission(request, view, self.contest))

    def test_has_object_permission_send_email_action_non_staff_user(
        self,
    ):
        request = self.factory.post(
            f"/api/contests/{self.contest.id}/send_email/",
            {
                "subject": "Test",
                "message": "Test",
                "receivers": [{"email": "test@example.com"}],
            },
        )
        request.user = self.user
        request.user.is_staff = False
        view = ContestViewSet()
        view.action = "send_email"
        permission = ContestPermission
