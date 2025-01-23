from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from invitations.models import Invitation
from invitations.serializers import InvitationSerializer


# Create your views here.
class InviteViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]