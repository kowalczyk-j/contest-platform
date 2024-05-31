from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from contest_platform.models import User
from rest_framework.test import APIRequestFactory
from contest_platform.views import (
    UserViewSet,
)
from contest_platform.permissions import (
    UserPermission,
)


class UserPermissionTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

    def test_has_permission_create_action(self):
        request = self.factory.post("/api/users/", {"username": "newuser"})
        view = UserViewSet()
        view.action = "create"
        permission = UserPermission()

        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_list_action_authenticated_staff(self):
        request = self.factory.get("/api/users/")
        request.user = self.user
        request.user.is_staff = True
        view = UserViewSet()
        view.action = "list"
        permission = UserPermission()

        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_list_action_unauthenticated(self):
        request = self.factory.get("/api/users/")
        request.user = AnonymousUser()
        view = UserViewSet()
        view.action = "list"
        permission = UserPermission()

        self.assertFalse(permission.has_permission(request, view))

    def test_has_object_permission_retrieve_action_own_user(self):
        other_user = User.objects.create_user(
            username="otheruser",
            password="testpassword",
            email="sssssssssss@wp.pl"
        )
        request = self.factory.get("/api/users/1/")
        request.user = self.user
        view = UserViewSet()
        view.action = "retrieve"
        permission = UserPermission()

        # Existing user (self.user) should not have permission to retrieve other_user's info
        self.assertFalse(permission.has_object_permission(request, view, other_user))

    def test_has_object_permission_retrieve_action_staff_user(self):
        user = User.objects.create_user(
            username="otheruser",
            password="testpassword",
            email="skibidiemail@wp.pl"
            )
        request = self.factory.get("/api/users/1/")
        request.user = self.user
        request.user.is_staff = True
        view = UserViewSet()
        view.action = "retrieve"
        permission = UserPermission()

        # Staff user (self.user) should have permission to retrieve user's info
        self.assertTrue(permission.has_object_permission(request, view, user))

    def test_has_object_permission_retrieve_action_unauthenticated(
        self,
    ):
        user = User.objects.create_user(
            username="otheruser",
            password="testpassword",
            email="testemail232Wwp.pl"
            )
        request = self.factory.get("/api/users/1/")
        request.user = AnonymousUser()
        view = UserViewSet()
        view.action = "retrieve"
        permission = UserPermission()

        # Unauthenticated user should not have permission to retrieve user's info
        self.assertFalse(permission.has_object_permission(request, view, user))

    def test_has_object_permission_retrieve_action_same_user(self):
        request = self.factory.get(f"/api/users/{self.user.id}/")
        request.user = self.user
        view = UserViewSet()
        view.action = "retrieve"
        permission = UserPermission()

        # User should have permission to retrieve their own info
        self.assertTrue(permission.has_object_permission(request, view, self.user))

    def test_has_permission_update_action_authenticated_user(self):
        request = self.factory.put(
            f"/api/users/{self.user.id}/", {"username": "updateduser"}
        )
        request.user = self.user
        view = UserViewSet()
        view.action = "update"
        permission = UserPermission()

        # Authenticated user (self.user) should have permission to update their own info
        self.assertTrue(permission.has_permission(request, view))
