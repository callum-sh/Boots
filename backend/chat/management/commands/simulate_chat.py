import uuid

from django.core.management.base import BaseCommand
from django.utils import timezone

from chat.agent import handle_message
from chat.imessage import FakeChat
from chat.models import ChatMessage


class Command(BaseCommand):
    help = 'Fake group chat in the terminal. Type "name: message", e.g. "ming: ran 5k". Ctrl-D to quit.'

    def add_arguments(self, parser):
        parser.add_argument("--chat", default="simulated-chat")

    def handle(self, *args, **options):
        chat = FakeChat()
        while True:
            try:
                line = input("> ")
            except EOFError:
                break
            sender, _, text = line.partition(":")
            if not text.strip():
                self.stdout.write('format is "name: message"')
                continue
            message = ChatMessage.objects.create(
                guid=f"sim-{uuid.uuid4()}", chat_guid=options["chat"], handle=sender.strip().lower(),
                sent_at=timezone.now(), text=text.strip(),
            )
            handle_message(message, chat=chat)
            for sent in chat.sent:
                if sent["image"]:
                    path = f"boots-card-{message.pk}.png"
                    with open(path, "wb") as f:
                        f.write(sent["image"])
                    self.stdout.write(f"boots: [image saved to {path}]")
                if sent["text"]:
                    self.stdout.write(f"boots: {sent['text']}")
            chat.sent.clear()
