from rest_framework import viewsets

from competitions.models import *
from competitions.serializer import *

class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

class CategoryViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ParticipantViewSet(viewsets.ViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

class GoalViewSet(viewsets.ViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer