from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import User


# ---------------------------
# Register Serializer
# ---------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "bio",
            "avatar",
        )

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ---------------------------
# Login Serializer
# ---------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data["email"],  # because USERNAME_FIELD = email
            password=data["password"],
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        data["user"] = user
        return data


# ---------------------------
# Profile Serializer
# ---------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "bio",
            "avatar",
        )