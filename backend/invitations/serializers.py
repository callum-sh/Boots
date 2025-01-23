from rest_framework import serializers

from invitations.models import Invitation
from competitions.serializer import Competition, ParticipantSerializer

class InvitationSerializer(serializers.ModelSerializer):
    competition = Competition(many=True, read_only=True)
    participants = ParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Invitation
        fields = '__all__'