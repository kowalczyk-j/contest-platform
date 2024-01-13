from .models import Address, GradeCriterion, Contest, Entry, Person, Grade
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
    contestants = PersonSerializer(many=True, read_only=True)

    class Meta:
        model = Entry
        fields = ("id",
                  "contest",
                  "user",
                  "contestants",
                  "address",
                  "email",
                  "entry_title",
                  "entry_file")


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ("id",
                  "street",
                  "number",
                  "postal_code",
                  "city")


class GradeCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeCriterion
        fields = ("id",
                  "contest",
                  "description",
                  "max_rating")


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ("id",
                  "criterion",
                  "entry",
                  "value")
