from django.core.management.base import BaseCommand

from chat.agent import handle_message
from chat.models import ChatMessage


class Command(BaseCommand):
    help = "Retry chat messages that were stored but never processed."

    def handle(self, *args, **options):
        for message in ChatMessage.objects.filter(processed_at__isnull=True):
            handle_message(message)
            self.stdout.write(f"processed {message.guid}")
