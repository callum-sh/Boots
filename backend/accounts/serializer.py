from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "first_name", "password"]
        extra_kwargs = {
            "password": {"write_only": True},  # Ensure the password is write-only
        }

    def validate_email(self, value):
        """
        Validate that the email is unique and properly formatted.
        """
        try:
            # Validate email format
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Enter a valid email address.")

        # Check email uniqueness
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return value

    def create(self, validated_data):
        """
        Create a new user with the validated data.
        """
        user = User.objects.create_user(
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            password=validated_data["password"],
        )
        return user