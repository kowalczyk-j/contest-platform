from django.test import TestCase
from contest_platform.serializers import (
    ContestSerializer,
)
from contest_platform.models import Contest
import datetime
from rest_framework import serializers

RULES_PDF = "https://pzsp2bucket.blob.core.windows.net/entries/Regulamin%20Konkursu%20na%20kartk%C4%99%20wielkanocn%C4%85_%202023.pdf"
POSTER_PDF = "https://pzsp2bucket.blob.core.windows.net/entries/choinka.jpg"


class ContestSerializerTest(TestCase):
    def test_contest_serializer_valid_dates(self):
        # Given
        data = {
            "title": "Programming Contest",
            "description": "A coding competition",
            "date_start": "2024-01-01",
            "date_end": "2024-02-01",
            "individual": True,
            "type": "Online",
        }

        # When
        serializer = ContestSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Then
        self.assertEqual(
            serializer.validated_data["date_start"],
            datetime.date(2024, 1, 1),
        )
        self.assertEqual(
            serializer.validated_data["date_end"],
            datetime.date(2024, 2, 1),
        )

    def test_contest_serializer_invalid_dates(self):
        # Given
        data = {
            "title": "Programming Contest",
            "description": "A coding competition",
            "date_start": "2024-02-01",
            "date_end": "2024-01-01",
            "individual": True,
            "type": "Online",
        }

        # When
        serializer = ContestSerializer(data=data)

        # Then
        self.assertFalse(serializer.is_valid())
        self.assertIn("date_start", serializer.errors)
        self.assertEqual(
            serializer.errors["date_start"][0],
            "Date start must be before date end.",
        )

    def test_contest_serializer_valid_date_range(self):
        # Given
        data = {
            "title": "Programming Contest",
            "date_start": "2024-01-01",
            "date_end": "2024-02-01",
            "individual": True,
        }

        # When
        serializer = ContestSerializer(data=data)

        # Then
        self.assertTrue(serializer.is_valid())
        serializer.save()

    def test_contest_serializer_invalid_date_range(self):
        # Given
        data = {
            "title": "Programming Contest",
            "date_start": "2024-02-01",
            "date_end": "2024-01-01",
            "individual": True,
        }

        # When
        serializer = ContestSerializer(data=data)

        # Then
        self.assertFalse(serializer.is_valid())
        self.assertIn(
            "Date start must be before date end.",
            serializer.errors["date_start"],
        )

    def test_contest_serializer_unique_title(self):
        # Given
        Contest.objects.create(
            title="Programming Contest",
            date_start="2024-01-01",
            date_end="2024-02-01",
            individual=True,
        )

        data = {
            "title": "Programming Contest",
            "date_start": "2024-03-01",
            "date_end": "2024-04-01",
            "individual": True,
        }

        # When
        serializer = ContestSerializer(data=data)

        # Then
        serializer = ContestSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})

    def test_contest_serializer_valid_with_optional_fields(self):
        # Given
        data = {
            "title": "Optional Fields Contest",
            "date_start": "2024-01-01",
            "date_end": "2024-02-01",
            "individual": True,
            "type": "Online",
            "rules_pdf": RULES_PDF,
            "poster_img": POSTER_PDF,
        }

        # When
        serializer = ContestSerializer(data=data)

        # Then
        self.assertTrue(serializer.is_valid())
        serializer.save()

    def test_contest_serializer_invalid_url_format(self):
        # Given
        data = {
            "title": "Invalid URL Format",
            "date_start": "2024-01-01",
            "date_end": "2024-02-01",
            "individual": True,
            "type": "Online",
            "rules_pdf": "invalid-url",
            "poster_img": "invalid-url",
        }

        # When
        serializer = ContestSerializer(data=data)

        # Then
        self.assertFalse(serializer.is_valid())
        self.assertIn("rules_pdf", serializer.errors)
        self.assertIn("poster_img", serializer.errors)
