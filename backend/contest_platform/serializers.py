from .models import Contest
from .models import User
from rest_framework.serializers import ModelSerializer


class ContestSerializer(ModelSerializer):
    class Meta:
        model = Contest
        fields = '__all__'


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User(
            username=validated_data["username"], email=validated_data["email"])
        user.set_password(validated_data["password"])
        user.save()
        return user
