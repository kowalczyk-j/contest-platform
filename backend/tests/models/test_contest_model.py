from django.test import TestCase
from django.contrib.auth import get_user_model
from datetime import date
from contest_platform.models import Contest

User = get_user_model()


class ContestModelTest(TestCase):
    def setUp(self):
        self.contest = Contest.objects.create(
            title="Programming Contest",
            description="A coding competition",
            date_start=date.today(),
            date_end=date.today(),
            individual=True,
            type="Programming",
            rules_pdf="https://rules.pdf",
            poster_img="https://poster.jpg",
        )

    def test_contest_fields(self):
        self.assertEqual(self.contest.title, "Programming Contest")
        self.assertEqual(self.contest.description, "A coding competition")
        self.assertEqual(self.contest.date_start, date.today())
        self.assertEqual(self.contest.date_end, date.today())
        self.assertTrue(self.contest.individual)
        self.assertEqual(self.contest.type, "Programming")
        self.assertEqual(self.contest.rules_pdf, "https://rules.pdf")
        self.assertEqual(self.contest.poster_img, "https://poster.jpg")

    def test_contest_str(self):
        expected_str = str((self.contest.title, self.contest.description))
        self.assertEqual(str(self.contest), expected_str)

    def test_contest_validity(self):
        try:
            self.contest.full_clean()
        except Exception as e:
            self.fail(f"Model validation error: {e}")
