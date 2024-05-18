from django.test import TestCase
from contest_platform.models import Address
from django.db import IntegrityError


class AddressModelTest(TestCase):
    def setUp(self):
        self.address = Address.objects.create(
            street="Miodowa",
            number="123",
            postal_code="12345",
            city="Warszawa",
        )

    def test_address_creation(self):
        self.assertEqual(self.address.street, "Miodowa")
        self.assertEqual(self.address.number, "123")
        self.assertEqual(self.address.postal_code, "12345")
        self.assertEqual(self.address.city, "Warszawa")

    def test_address_str_method(self):
        expected_str = "Miodowa 123, 12345 Warszawa"
        self.assertEqual(str(self.address), expected_str)

    def test_address_str_method_with_special_characters(self):
        address_with_special_chars = Address.objects.create(
            street="Kwiatowa",
            number="456",
            postal_code="!@#$%",
            city="@#$%^&*",
        )
        expected_str = "Kwiatowa 456, !@#$% @#$%^&*"
        self.assertEqual(str(address_with_special_chars), expected_str)

    def test_address_max_length(self):
        max_length = {
            "street": 50,
            "number": 10,
            "postal_code": 6,
            "city": 20,
        }
        for field, length in max_length.items():
            with self.subTest(field=field):
                field_value = getattr(self.address, field)
                self.assertLessEqual(len(field_value), length)

    def test_address_unique_constraint(self):
        try:
            duplicate_address = Address(
                street=self.address.street,
                number=self.address.number,
                postal_code=self.address.postal_code,
                city=self.address.city,
            )
        except ExceptionType:
            self.fail("duplicate_address() raised ExceptionType unexpectedly!")
