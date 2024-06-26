from .models import (
    GradeCriterion,
    Contest,
    Entry,
    Person,
    Grade,
    School,
    User,
)
from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


# REQ_06C
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "is_staff",
            "is_jury",
            "is_coordinating_unit",
            "is_superuser",
            "is_newsletter_subscribed",
            "is_active",
            "date_joined",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    # REQ_06C_END

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            is_coordinating_unit=validated_data["is_coordinating_unit"],
            is_newsletter_subscribed=validated_data["is_newsletter_subscribed"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

    def validate(self, data):
        for field_name in ["first_name", "last_name", "email"]:
            if not data.get(field_name):
                raise serializers.ValidationError("Uzupełnij poprawnie wszystkie pola.")

        email = data.get("email")
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError("Niepoprawny adres e-mail.")

        return data

    def validate_email(self, value):
        if self.instance is not None:  # check while updating data
            if (
                User.objects.filter(email__iexact=value)
                .exclude(pk=self.instance.pk)
                .exists()
            ):
                raise serializers.ValidationError("Ten adres e-mail jest już zajęty.")
        else:  # check while creating new user
            if User.objects.filter(email__iexact=value).exists():
                raise serializers.ValidationError("Ten adres e-mail jest już zajęty.")

        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Niepoprawny adres e-mail.")

        return value


class ContestSerializer(serializers.ModelSerializer):
    date_start = serializers.DateField(input_formats=["%Y-%m-%d"])
    date_end = serializers.DateField(input_formats=["%Y-%m-%d"])

    # REQ_10
    def validate(self, data):
        if data.get("date_start") and data.get("date_end"):
            if data["date_start"] > data["date_end"]:
                raise serializers.ValidationError(
                    {"date_start": "Data rozpoczęcia musi być przed datą zakończenia."}
                )
        return data

    # REQ_10_END

    class Meta:
        model = Contest
        fields = (
            "id",
            "title",
            "description",
            "date_start",
            "date_end",
            "individual",
            "type",
            "status",
            "rules_pdf",
            "poster_img",
        )


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ("id", "name", "surname")


class EntrySerializer(serializers.ModelSerializer):
    contestants = PersonSerializer(many=True, read_only=False)

    def create(self, validated_data):
        # Create the entry instance
        # Before adding contestants, validity check of entry data is performed
        contestants = validated_data.pop("contestants")
        entry = Entry(**validated_data)

        user = validated_data["user"]
        contest = validated_data["contest"]
        existing_entry = Entry.objects.filter(user=user, contest=contest).exists()

        # REQ_23
        if existing_entry and not (user.is_staff or user.is_coordinating_unit):
            raise serializers.ValidationError(
                {"user": "Użytkownik nie może mieć więcej niż jednego zgłoszenia."}
            )
        # REQ_23_END

        entry.save()
        person_list = []
        # Iterate over the contestants data and add them to the entry
        for contestant_data in contestants:
            contestant = Person.objects.create(**contestant_data)
            person_list.append(contestant)

        entry.contestants.set(person_list)

        # Create Grade instances based on GradeCriterions
        grade_criterions = GradeCriterion.objects.filter(contest=contest)
        for criterion in grade_criterions:
            Grade.objects.create(criterion=criterion, entry=entry)

        return entry

    class Meta:
        model = Entry
        fields = (
            "id",
            "contest",
            "user",
            "contestants",
            "date_submitted",
            "email",
            "entry_title",
            "entry_file",
            "favourite",
            "canceled",
        )


class GradeCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeCriterion
        fields = ("id", "contest", "description", "max_rating", "user")


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ("id", "criterion", "entry", "value", "description")


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = (
            "id",
            "name",
            "street",
            "building_number",
            "apartment_number",
            "postal_code",
            "city",
            "phone",
            "fax",
            "email",
            "website",
            "audience_status",
            "institution_specifics",
            "director_name",
        )
