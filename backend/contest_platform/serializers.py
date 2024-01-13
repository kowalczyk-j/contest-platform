from .models import Address, GradeCriterion, Contest, Entry, Person
from .models import User
from rest_framework import serializers


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
            "is_superuser",
            "is_active",
            "date_joined",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User(
            username=validated_data["username"], email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class ContestSerializer(serializers.ModelSerializer):
    date_start = serializers.DateField(input_formats=["%Y-%m-%d"])
    date_end = serializers.DateField(input_formats=["%Y-%m-%d"])

    def validate(self, data):
        if data.get("date_start") and data.get("date_end"):
            if data["date_start"] > data["date_end"]:
                raise serializers.ValidationError(
                    {"date_start": "Date start must be before date end."}
                )
        return data

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
        contestants = validated_data.pop("contestants")
        entry = Entry(**validated_data)
        entry.save()
        person_list = []
        # Iterate over the contestants data and add them to the entry
        for contestant_data in contestants:
            contestant = Person.objects.create(**contestant_data)
            person_list.append(contestant)

        entry.contestants.set(person_list)

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
        )


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ("id", "street", "number", "postal_code", "city")


class GradeCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeCriterion
        fields = ("id", "contest", "description", "max_rating")
