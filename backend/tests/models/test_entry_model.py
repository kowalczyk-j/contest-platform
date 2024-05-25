from django.test import TestCase
from datetime import date
from contest_platform.models import Contest, Entry, Person, User
from django.contrib.auth import get_user_model

User = get_user_model()


class EntryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
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
        self.person = Person.objects.create(name="John", surname="Doe")
        self.entry_data = {
            "contest": self.contest,
            "user": self.user,
            "date_submitted": date.today(),
            "entry_title": "Test Entry",
            "email": "test@example.com",
            "entry_file": "https://example.com/test-entry-file",
        }
        self.entry_data_no_file = {
            "contest": self.contest,
            "user": self.user,
            "date_submitted": date.today(),
            "entry_title": "Test Entry",
            "email": "test@example.com",
        }

    def test_entry_fields(self):
        entry = Entry.objects.create(**self.entry_data)
        entry.contestants.add(self.person)

        self.assertEqual(entry.contest, self.contest)
        self.assertEqual(entry.user, self.user)
        self.assertEqual(entry.date_submitted, date.today())
        self.assertEqual(entry.entry_title, "Test Entry")
        self.assertEqual(entry.email, "test@example.com")
        self.assertEqual(entry.entry_file, "https://example.com/test-entry-file")
        self.assertEqual(list(entry.contestants.all()), [self.person])

    def test_entry_file_field_null(self):
        entry = Entry.objects.create(**self.entry_data_no_file, entry_file=None)
        self.assertIsNone(entry.entry_file)

    def test_entry_contestants_field(self):
        entry = Entry.objects.create(**self.entry_data)
        entry.contestants.add(self.person)

        self.assertEqual(list(entry.contestants.all()), [self.person])

    def test_entry_validity(self):
        try:
            entry = Entry.objects.create(**self.entry_data)
            entry.full_clean()
        except Exception as e:
            self.fail(f"Model validation error: {e}")
