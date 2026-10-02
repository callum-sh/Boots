from django.core.management.base import BaseCommand
from django.utils import timezone

from chat.agent import finish_competition
from competitions.models import Competition


class Command(BaseCommand):
    help = "Post the summary for chat competitions whose end date has passed. Run daily."

    def handle(self, *args, **options):
        due = Competition.objects.exclude(chat_guid="").filter(
            summary_sent_at__isnull=True, end_date__lte=timezone.now()
        )
        for competition in due:
            finish_competition(competition)
            self.stdout.write(f"ended {competition.name}")
