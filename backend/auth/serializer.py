from django.contrib.auth import get_user_model
from rest_framework import serializers
import re

class CreateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    first_name = serializers.CharField(required=True)
    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'first_name')
        write_only_fields = ('password',)
        read_only_fields = ('is_staff', 'is_superuser', 'is_active',)

    def validate_email(self, value):
        """
        Ensure the email is unique and matches a valid email pattern.
        """
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        
        User = get_user_model()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        
        return value

    def create(self, validated_data):
        User = get_user_model()
        user = User.objects.create(
            first_name=validated_data.get('first_name', ''),
            email=validated_data['email'],  # Set email
            username=validated_data['email'],  # Set username as email
        )
        user.set_password(validated_data['password'])
        user.is_authenticated = True
        user.save()
        return user