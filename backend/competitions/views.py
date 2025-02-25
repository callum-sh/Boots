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
        data["user"] = request.user.id
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

    def list(self, request):
        """
        List all competitions that the user is a participant in.

        """
        queryset = Competition.objects.filter(participants__user=request.user)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    def create(self, request):
        """
        Create new competition with creating user as owner and participant.

        """
        data = request.data

        # Validate required fields
        required_fields = ["name", "description", "start_date", "end_date"]
        if not all(field in data for field in required_fields):
            return Response({"error": "Missing required fields"}, status=400)

        # Create the competition
        new_competition = Competition.objects.create(
            name=data["name"],
            description=data["description"],
            start_date=data["start_date"],
            end_date=data["end_date"],
        )

        # Create or get the participant (owner)
        owner, created = Participant.objects.get_or_create(
            user=request.user, competition=new_competition
        )

        if not created and not owner:
            return Response({"error": "Participant retrieval error"}, status=400)

        # Add categories if provided
        if "categories" in data:
            try:
                new_competition.categories.set(data["categories"])
            except Exception as e:
                return Response({"error": f"Invalid categories: {str(e)}"}, status=400)

        # Add the owner as an admin
        new_competition.admins.add(request.user)

        return Response(CompetitionSerializer(new_competition).data, status=201)


class CategoryViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

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
        data["participant"] = Participant.objects.get(user=request.user).id
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


@api_view(["PUT"])
def join_competition(request, pk):
    print("*******", request.user)
    competition = Competition.objects.get(pk=pk)
    participant = Participant.objects.create(user=request.user, competition=competition)

    if not participant:
        return Response({"error": "Participant creation error"}, status=400)

    return Response({"message": f"Successfully joined {competition.name}"}, status=200)
