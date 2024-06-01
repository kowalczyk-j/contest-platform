from django.db import models
from rest_framework import permissions
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request


class UserPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action == "create":
            return True
        if view.action == "list":
            return request.user.is_authenticated and request.user.is_staff
        elif view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
            "current_user",
            "emails_subscribed",
            "jury_users",
            "update_profile",
            "change_password",
            "delete_account",
            "update_status",
        ]:
            return True
        else:
            return False

    def has_object_permission(
        self,
        request: Request,
        view: GenericAPIView,
        obj: models.Model,
    ) -> bool:
        if not request.user.is_authenticated:
            return False

        if view.action in [
            "retrieve",
            "update",
            "partial_update",
            "current_user",
            "jury_users",
            "update_profile",
            "change_password",
            "destroy",
            "delete_account",
        ]:
            # a user can view its own info, or a staff can view any user's info
            return obj == request.user or request.user.is_staff
        elif view.action in [
            "emails_subscribed",
            "update_status",
        ]:
            return request.user.is_staff
        else:
            return False


class ContestPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action in [
            "list",
            "max_rating_sum",
            "retrieve",
            "update",
            "partial_update",
            "destroy",
            "entries",
            "send_email",
            "get_contestants_amount",
            "group_individual_comp",
            "get_submissions_by_day",
            "get_entry_amount",
            "generate_certificate",
            "send_certificates",
            "delete_with_related",
        ]:
            return True
        if view.action == "create":
            return request.user.is_authenticated and request.user.is_staff
        else:
            return False

    def has_object_permission(
        self,
        request: Request,
        view: GenericAPIView,
        obj: models.Model,
    ) -> bool:
        if view.action == "retrieve":
            return True
        elif view.action in ["send_email", "delete_with_related"]:
            return request.user.is_authenticated and request.user.is_staff
        elif view.action in [
            "update",
            "partial_update",
            "destroy",
            "max_rating_sum",
            "get_contestants_amount",
            "group_individual_comp",
            "get_submissions_by_day",
            "get_entry_amount",
            "generate_certificate",
            "send_certificates",
        ]:
            return request.user.is_authenticated and (
                request.user.is_staff or request.user.is_jury
            )
        else:
            return False


class EntryPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action == "list":
            return request.user.is_authenticated and (
                request.user.is_staff
                or request.user.is_jury
                or request.query_params.get("user", "") == str(request.user.id)
            )
        if view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
            "total_grade_value",
            "delete_with_related",
            "create"
        ]:
            return True
        else:
            return False

    def has_object_permission(
        self,
        request: Request,
        view: GenericAPIView,
        obj: models.Model,
    ) -> bool:
        if view.action in [
            "retrieve",
            "update",
            "partial_update",
            "total_grade_value",
        ]:
            return request.user.is_authenticated and (
                request.user == obj.user
                or request.user.is_staff
                or request.user.is_jury
            )
        if view.action in ["destroy", "delete_with_related"]:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return False


class GradeCriterionPermissions(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
        ]:
            return request.user.is_authenticated
        elif view.action in ["list", "create"]:
            return request.user.is_authenticated and request.user.is_staff
        else:
            return False

    def has_object_permission(
        self,
        request: Request,
        view: GenericAPIView,
        obj: models.Model,
    ) -> bool:
        if view.action in ["update", "partial_update", "retrieve"]:
            return request.user.is_staff or request.user.is_jury
        elif view.action == "destroy":
            return request.user.is_staff
        else:
            return False


class GradePermissions(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
            "to_evaluate",
        ]:
            return request.user.is_authenticated
        elif view.action == "list":
            return request.user.is_authenticated and (
                request.user.is_staff or request.user.is_jury
            )
        elif view.action == "create":
            return request.user.is_authenticated and request.user.is_staff
        else:
            return False

    def has_object_permission(
        self,
        request: Request,
        view: GenericAPIView,
        obj: models.Model,
    ) -> bool:
        if view.action == "retrieve":
            return (
                request.user.is_staff
                or request.user.is_jury
                or obj.entry.user == request.user
            )
        elif view.action in ["update", "partial_update"]:
            return request.user.is_staff or request.user.is_jury
        elif view.action in ["destroy"]:
            return request.user.is_staff
        else:
            return False


class SchoolPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action == "list":
            return request.user.is_staff
        if view.action == "create":
            return request.user.is_staff
        elif view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
            "emails",
        ]:
            return True
        else:
            return False

    def has_object_permission(
        self,
        request: Request,
        view: GenericAPIView,
        obj: models.Model,
    ) -> bool:
        if not request.user.is_authenticated:
            return False

        if view.action in [
            "retrieve",
            "update",
            "partial_update",
        ]:
            return request.user.is_staff
        elif view.action in [
            "destroy",
            "emails",
        ]:
            return request.user.is_staff
        else:
            return False
