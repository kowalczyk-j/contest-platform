from rest_framework import serializers
from .models import Address, AssessmentCriterion, Contest, Entry


class ContestSerializer(serializers.ModelSerializer):
    date_start = serializers.DateField(input_formats=['%Y-%m-%d'])
    date_end = serializers.DateField(input_formats=['%Y-%m-%d'])

    class Meta:
        model = Contest
        fields = ("id",
                  "title",
                  "description",
                  "date_start",
                  "date_end",
                  "individual",
                  "type",
                  "rules_pdf",
                  "poster_img")


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ("id",
                  "contest",
                  "contestant_name",
                  "parent_name",
                  "contestant_surname",
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


class AssessmentCriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentCriterion
        fields = ("id",
                  "contest",
                  "description",
                  "max_rating")
