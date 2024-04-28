from django.test import override_settings
from django.core import mail
from django_dramatiq.test import DramatiqTestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from contest_platform.models import User, Contest
from contest_platform.tasks import send_email_task


class SendEmailTest(DramatiqTestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.contest = Contest.objects.create(title="Test Contest")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.request_params = {
            "path": f"/api/contests/{self.contest.id}/send_email/",
            "data": {
                "subject": "Test",
                "message": "Test",
                "receivers": [],
            },
            "format": "json",
        }

    @override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
    def test_send_email(self):
        self.request_params["data"]["receivers"] = [{"email": "test1@example.com"}]
        response = self.client.post(**self.request_params)

        self.broker.join(send_email_task.queue_name)
        self.worker.join()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "Test")

    @override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
    def test_send_email_multiple_receivers(self):
        self.request_params["data"]["receivers"] = [
            {"email": "test2@example.com"},
            {"email": "test3@example.com"},
        ]
        response = self.client.post(**self.request_params)

        self.broker.join(send_email_task.queue_name)
        self.worker.join()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            len(mail.outbox[0].recipients()),
            len(self.request_params["data"]["receivers"]),
        )
        self.assertEqual(mail.outbox[0].subject, "Test")
