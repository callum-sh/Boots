from rest_framework import serializers
from competitions.models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ParticipantSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Participant
        fields = '__all__'

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'

class CompetitionSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)
    participants = ParticipantSerializer(many=True, read_only=True)
    class Meta:
        model = Competition
        fields = '__all__'

    def create(self, validated_data):
        categories_data = validated_data.pop('categories', [])
        competition = Competition.objects.create(**validated_data)
        for category_data in categories_data:
            category, _ = Category.objects.get_or_create(**category_data)
            competition.categories.add(category)
        return competition