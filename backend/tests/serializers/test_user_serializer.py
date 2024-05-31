from django.test import TestCase
from contest_platform.serializers import (
    UserSerializer,
)


class UserSerializerTest(TestCase):
    def test_user_serializer_create(self):
        # Given
        data = {
            "username": "john_doe",
            "first_name": "john",
            "last_name": "doe",
            "email": "jodsdshn@example.com",
            "is_coordinating_unit": True,
            "password": "secure_password",
            "is_newsletter_subscribed": False
        }

        # When
        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Then
        self.assertEqual(user.username, "john_doe")
        self.assertEqual(user.email, "jodsdshn@example.com")
        self.assertTrue(user.is_coordinating_unit)
        self.assertTrue(user.check_password("secure_password"))

    def test_user_serializer_unique_username(self):
        # Given
        data = {
            "username": "john_doe2",
            "first_name": "john2",
            "last_name": "doe2",
            "email": "jodsdsh2n@example.com",
            "is_coordinating_unit": True,
            "password": "secure_password",
            "is_newsletter_subscribed": False
        }

        # Create a user with the initial data
        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=False)
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
