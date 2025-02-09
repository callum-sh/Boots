from rest_framework import serializers
from competitions.models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ParticipantSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.first_name')
    class Meta:
        model = Participant
        fields = '__all__'

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'

class InviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invite
        fields = '__all__'

class CompetitionSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    participants = ParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Competition
        fields = '__all__'