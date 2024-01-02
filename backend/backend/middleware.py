import logging
from django.utils.deprecation import MiddlewareMixin
from rest_framework.request import Request

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request: Request):
        logger.info(
            f"Method: {request.method}, Path: {request.path}, "
            f"GET Data: {request.GET}, POST Data: {request.POST}, "
            f"Headers: {request.headers}, User: {
                request.user if request.user.is_authenticated else 'Anonymous'}"
            "\n"
        )
