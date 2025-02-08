from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
import re

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
    )
    username = serializers.CharField()
    password = serializers.CharField(
        style={"input_type": "password"},
        write_only=True
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user