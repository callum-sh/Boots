from rest_framework import viewsets
from rest_framework.response import Response

from competitions.models import *
from competitions.serializer import *



class ParticipantViewSet(viewsets.ViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    def list(self, request):
        queryset = self.queryset.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        data = request.data
        data['user'] = request.user.id
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        queryset = self.queryset.get(pk=pk)
        serializer = self.serializer_class(queryset)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        instance = self.queryset.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(instance, data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    # TODO: no permissions needed rn; must add
    permission_classes = []

    def create(self, request):
        print(request.user.id)
        print(request.data)
        
        # get or create the participant
        owner, valid = Participant.objects.get_or_create(user=request.user.id)
        if not valid:
            return Response({'error': 'Participant retrieval error'}, status=400)
        
        data = request.data
        data['owner'] = owner.id
        data['participants'] = [owner.id]

        # create the competition
        new_competition = Competition.objects.create(**data)
        new_competition.save()

        serialized = self.serializer_class(new_competition)
        return Response(serialized.data)

class CategoryViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [] # TODO 

    def list(self, request):
        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        queryset = self.queryset.get(pk=pk)
        serializer = self.serializer_class(queryset)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        instance = self.queryset.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(instance, data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)



class GoalViewSet(viewsets.ViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def list(self, request):
        queryset = self.queryset.filter(participant__user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        data = request.data
        data['participant'] = Participant.objects.get(user=request.user).id
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        queryset = self.queryset.get(pk=pk)
        serializer = self.serializer_class(queryset)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        instance = self.queryset.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(instance, data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
