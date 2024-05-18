from django.test import TestCase

# Create your tests here.
#
import datetime
from contest_platform.models import User
from django.test import TestCase
from contest_platform.models import (
    Contest,
    Entry,
    GradeCriterion,
    Grade,
)
from contest_platform.serializers import (
    EntrySerializer,
)
from rest_framework import serializers


class EntrySerializerTestCoordinatingUnit(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="john_doe",
            email="john@example.com",
            is_coordinating_unit=True,
        )
        self.contest = Contest.objects.create(
            title="Programming Contest",
            date_start="2024-01-01",
            date_end="2024-02-01",
        )

    def test_entry_serializer_create(self):
        # Given
        contestants_data = [
            {"name": "Alice", "surname": "Johnson"},
            {"name": "Bob", "surname": "Smith"},
        ]
        data = {
            "contest": self.contest.id,
            "user": self.user.id,
            "contestants": contestants_data,
            "date_submitted": "2024-01-15",
            "email": "john@example.com",
            "entry_title": "Python Project",
            "entry_file": "https://pzsp2bucket.blob.core.windows.net/entries/Bez%20tytu%C5%82u.jpg",
        }

        # When
        serializer = EntrySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        entry = serializer.save()

        # Then
        self.assertEqual(entry.contest, self.contest)
        self.assertEqual(entry.user, self.user)
        self.assertEqual(entry.date_submitted, datetime.date(2024, 1, 15))
        self.assertEqual(entry.email, "john@example.com")
        self.assertEqual(entry.entry_title, "Python Project")
        self.assertEqual(
            entry.entry_file,
            "https://pzsp2bucket.blob.core.windows.net/entries/Bez%20tytu%C5%82u.jpg",
        )
        self.assertEqual(entry.contestants.count(), 2)

        # Check if Grade instances are created for each GradeCriterion
        grade_criterions = GradeCriterion.objects.filter(contest=self.contest)
        self.assertEqual(
            Grade.objects.filter(entry=entry).count(),
            grade_criterions.count(),
        )

    def test_entry_serializer_create_duplicate_entry_coordinating_unit(
        self,
    ):
        # Given
        Entry.objects.create(
            contest=self.contest,
            user=self.user,
            date_submitted="2024-01-10",
            email="john@example.com",
            entry_title="Entry 1",
            entry_file="https://pzsp2bucket.blob.core.windows.net/entries/Bez%20tytu%C5%82u.jpg",
        )
        contestants_data = [{"name": "Alice", "surname": "Johnson"}]
        data = {
            "contest": self.contest.id,
            "user": self.user.id,
            "contestants": contestants_data,
            "date_submitted": "2024-01-20",
            "email": "john@example.com",
            "entry_title": "Entry 2",
            "entry_file": "https://pzsp2bucket.blob.core.windows.net/entries/Bez%20tytu%C5%82u.jpg",
        }

        # When
        serializer = EntrySerializer(data=data)

        # Then
        self.assertTrue(serializer.is_valid())
        self.assertNotIn("user", serializer.errors)
        entries_before = Entry.objects.filter(contest=self.contest).count()
        serializer.save()
        self.assertEqual(
            Entry.objects.filter(contest=self.contest).count(),
            entries_before + 1,
        )


class EntrySerializerTestNotCoordinatingUnit(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="john_doe",
            email="john@example.com",
            is_coordinating_unit=False,
        )
        self.contest = Contest.objects.create(
            title="Programming Contest",
            date_start="2024-01-01",
            date_end="2024-02-01",
        )

    def test_entry_serializer_create_duplicate_entry_non_coordinating_unit(
        self,
    ):
        # Given
        Entry.objects.create(
            contest=self.contest,
            user=self.user,
            date_submitted="2024-01-10",
            email="john@example.com",
            entry_title="Entry 1",
            entry_file="https://pzsp2bucket.blob.core.windows.net/entries/Bez%20tytu%C5%82u.jpg",
        )
        contestants_data = [{"name": "Alice", "surname": "Johnson"}]
        data = {
            "contest": self.contest.id,
            "user": self.user.id,
            "contestants": contestants_data,
            "date_submitted": "2024-01-20",
            "email": "john@example.com",
            "entry_title": "Entry 2",
            "entry_file": "https://pzsp2bucket.blob.core.windows.net/entries/Bez%20tytu%C5%82u.jpg",
        }

        # When
        serializer = EntrySerializer(data=data)

        # Then
        self.assertTrue(serializer.is_valid())
        with self.assertRaises(serializers.ValidationError) as context:
            serializer.save()
        self.assertIn(
            "User cannot have more than one entry.",
            str(context.exception),
        )

    def test_entry_serializer_missing_required_field(self):
        # Given
        data = {
            "user": self.user.id,
            "contestants": [{"name": "Alice", "surname": "Johnson"}],
            "date_submitted": "2024-01-15",
            "email": "john@example.com",
            "entry_title": "Python Project",
            "entry_file": "https://example.com/entry_file.jpg",
        }

        # When
        serializer = EntrySerializer(data=data)

        # Then
        self.assertFalse(serializer.is_valid())
        self.assertIn("contest", serializer.errors)
        self.assertEqual(serializer.errors["contest"][0], "This field is required.")

    def test_entry_serializer_missing_contestants(self):
        # Given
        data = {
            "contest": self.contest.id,
            "user": self.user.id,
            "date_submitted": "2024-01-15",
            "email": "john@example.com",
            "entry_title": "Python Project",
            "entry_file": "https://example.com/entry_file.jpg",
        }

        # When
        serializer = EntrySerializer(data=data)

        # Then
        self.assertFalse(serializer.is_valid())
        self.assertIn("contestants", serializer.errors)
        self.assertEqual(
            serializer.errors["contestants"][0],
            "This field is required.",
        )
