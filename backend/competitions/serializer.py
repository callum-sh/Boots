from rest_framework import serializers
from competitions.models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ParticipantSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    competition = serializers.PrimaryKeyRelatedField(queryset=Competition.objects.all(), required=False)
    class Meta:
        model = Participant
        fields = '__all__'

class GoalSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    participant = ParticipantSerializer(read_only=True)
    class Meta:
        model = Goal
        fields = '__all__'

class CompetitionSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    participants = ParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Competition
        fields = '__all__'