import logging
from django.utils.deprecation import MiddlewareMixin
from rest_framework.request import Request
from django.db import transaction

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request: Request):
        user = request.user if request.user.is_authenticated else "Anonymous"
        logger.info(
            f"Method: {request.method}, Path: {request.path}, "
            f"GET Data: {request.GET}, POST Data: {request.POST}, "
            f"Headers: {request.headers}, User: {user}\n"
        )


class AtomicRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        with transaction.atomic():
            response = self.get_response(request)
        return response
