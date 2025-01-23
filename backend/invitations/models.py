from django.db import models
from competitions.models import Participant, Competition

# Create your models here.
class Invitation(models.Model):
    """
    Model to represent an invitation to a competition

    """
    invitee = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='invites_received')
    inviter = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='invite_sent')
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='invitations')

    def __str__(self):
        return f"{self.invitee.user.username} invited by {self.inviter.user.username} to {self.competition.name}"