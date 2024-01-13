from rest_framework import permissions
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request

from django.db import models


class UserPermission(permissions.BasePermission):

    def has_permission(self, request: Request, view: GenericAPIView) -> bool:

        if view.action == "create":
            return True
        if view.action == "list":
            return request.user.is_authenticated and request.user.is_staff
        elif view.action in ["retrieve", "update", "partial_update", "destroy", "current_user"]:
            return True
        else:
            return False

    def has_object_permission(
        self, request: Request, view: GenericAPIView, obj: models.Model
    ) -> bool:

        if not request.user.is_authenticated:
            return False

        if view.action in ["retrieve", "update", "partial_update", "current_user"]:
            # a user can view its own info, or a staff can view any user's info
            return obj == request.user or request.user.is_staff
        elif view.action == "destroy":
            return request.user.is_staff
        else:
            return False


class ContestPermission(permissions.BasePermission):

    def has_permission(self, request: Request, view: GenericAPIView) -> bool:

        if view.action in ["list", "max_rating_sum", "retrieve", "update", "partial_update", "destroy", "entries"]:
            return True
        elif view.action == "create":
            return request.user.is_authenticated and request.user.is_staff
        else:
            return False

    def has_object_permission(
        self, request: Request, view: GenericAPIView, obj: models.Model
    ) -> bool:

        if view.action == "retrieve":
            return True
        elif view.action in ["update", "partial_update", "destroy", "max_rating_sum"]:
            return request.user.is_authenticated and (request.user.is_staff or request.user.is_jury)
        else:
            return False


class EntryPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action in ["list", "by_contest_id"]:
            return request.user.is_authenticated and request.user.is_staff
        if view.action == "create":
            return request.user.is_authenticated
        if view.action in ["retrieve", "update", "partial_update", "destroy"]:
            return True
        else:
            return False

    def has_object_permission(
        self, request: Request, view: GenericAPIView, obj: models.Model
    ) -> bool:
        if view.action in ["retrieve", "update", "partial_update", "destroy", "by_contest_id"]:
            return request.user.is_authenticated and (request.user == obj.user or request.user.is_staff)
        else:
            return False


class GradeCriterionPermissions(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action in ["retrieve", "update", "partial_update", "destroy"]:
            return request.user.is_authenticated
        elif view.action in ["list", "create"]:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return False

    def has_object_permission(
        self, request: Request, view: GenericAPIView, obj: models.Model
    ) -> bool:

        if view.action == "retrieve":
            return request.user.is_staff or request.user.is_jury
        elif view.action in ["update", "partial_update", "destroy"]:
            return request.user.is_staff
        else:
            return False


class GradePermissions(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action in ["retrieve", "update", "partial_update", "destroy"]:
            return request.user.is_authenticated
        elif view.action == "list":
            return request.user.is_authenticated and (request.user.is_staff or request.user.is_jury)
        elif view.action == "create":
            return request.user.is_authenticated and request.user.is_staff
        else:
            return False

    def has_object_permission(
        self, request: Request, view: GenericAPIView, obj: models.Model
    ) -> bool:

        if view.action == "retrieve":
            return request.user.is_staff or request.user.is_jury or obj.entry.user == request.user
        elif view.action in ["update", "partial_update"]:
            return request.user.is_staff or request.user.is_jury
        elif view.action in ["destroy"]:
            return request.user.is_staff
        else:
            return False
