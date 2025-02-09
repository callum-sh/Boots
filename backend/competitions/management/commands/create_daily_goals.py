from django.core.management.base import BaseCommand
from competitions.models import Participant

class Command(BaseCommand):
    help = "Create daily goals for all participants in all competitions."

    def handle(self, *args, **kwargs):
        participants = Participant.objects.all()

        for participant in participants:
            participant.create_todays_goals()

        self.stdout.write(self.style.SUCCESS("Successfully created daily goals for all participants."))
