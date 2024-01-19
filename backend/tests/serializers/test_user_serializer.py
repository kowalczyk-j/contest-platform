from django.test import TestCase
from contest_platform.serializers import (
    UserSerializer,
)


class UserSerializerTest(TestCase):
    def test_user_serializer_create(self):
        # Given
        data = {
            "username": "john_doe",
            "email": "john@example.com",
            "is_coordinating_unit": True,
            "password": "secure_password",
        }

        # When
        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Then
        self.assertEqual(user.username, "john_doe")
        self.assertEqual(user.email, "john@example.com")
        self.assertTrue(user.is_coordinating_unit)
        self.assertTrue(user.check_password("secure_password"))

    def test_user_serializer_unique_username(self):
        # Given
        initial_data = {
            "username": "john_doe",
            "email": "john@example.com",
            "is_coordinating_unit": True,
            "password": "secure_password",
        }

        # Create a user with the initial data
        serializer = UserSerializer(data=initial_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Attempt to create another user with the same username
        duplicate_data = {
            "username": "john_doe",
            "email": "another_john@example.com",
            "is_coordinating_unit": False,
            "password": "another_secure_password",
        }

        # When
        duplicate_serializer = UserSerializer(data=duplicate_data)

        # Then
        self.assertFalse(duplicate_serializer.is_valid())
        self.assertIn("username", duplicate_serializer.errors)
        self.assertEqual(
            duplicate_serializer.errors["username"][0],
            "A user with that username already exists.",
        )

    def test_user_serializer_invalid_email_format(self):
        # Given
        data = {
            "username": "john_doe",
            "email": "invalid_email",
            "is_coordinating_unit": True,
            "password": "secure_password",
        }

        # When
        serializer = UserSerializer(data=data)

        # Then
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
        self.assertEqual(
            serializer.errors["email"][0],
            "Enter a valid email address.",
        )
