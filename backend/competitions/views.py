from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view

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
    permission_classes = []

    def create(self, request):
        # TODO: better way to validate form? 
        data = request.data
        new_competition = Competition.objects.create(
            name=data['name'],
            description=data['description'],
            start_date=data['start_date'],
            end_date=data['end_date'],
        )

        owner, created = Participant.objects.get_or_create(
            user=request.user,
            competition=new_competition
        )
        
        if not created and not owner:
            return Response({'error': 'Participant retrieval error'}, status=400)

        if 'categories' in data:
            new_competition.categories.set(data['categories'])
        
        new_competition.admins.set([owner.id])

        return Response(
            CompetitionSerializer(new_competition).data,
            status=201
        )

class CategoryViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [] 

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


@api_view(['PUT'])
def join_competition(request, pk):
    print(request.user)
    competition = Competition.objects.get(pk=pk)
    participant = Participant.objects.create(
        user=request.user,
        competition=competition
    )

    if not participant:
        return Response({'error': 'Participant creation error'}, status=400)
    
    return Response({'message': f'Successfully joined {competition.name}'}, status=200)