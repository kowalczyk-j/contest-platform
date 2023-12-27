from rest_framework import serializers
from .models import *


class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ("id", 
                  "title", 
                  "description",
                  "date_start",
                  "date_end",
                  "individual",
                  "type")
