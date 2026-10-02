import time

from django.core.management.base import BaseCommand, CommandError

from chat import local_imessage
from chat.agent import handle_message
from chat.models import ChatMessage


class Command(BaseCommand):
    help = "Run the agent against one group chat in this Mac's Messages app. --list shows the chats."

    def add_arguments(self, parser):
        parser.add_argument("--list", action="store_true", help="list group chats and exit")
        parser.add_argument("--chat", help="chat guid or exact group name")
        parser.add_argument("--interval", type=float, default=3)

    def handle(self, *args, **options):
        try:
            chats = local_imessage.list_group_chats()
        except Exception as error:
            raise CommandError(
                f"Can't read {local_imessage.DB} ({error}). Give this terminal Full Disk Access in "
                "System Settings > Privacy & Security, then restart it."
            )
        if options["list"] or not options["chat"]:
            for guid, name, handles in chats:
                self.stdout.write(f"{name or '(unnamed)'}\n  {guid}\n  {handles}")
            return
        matches = [c for c in chats if options["chat"] in (c[0], c[1])]
        if len(matches) != 1:
            raise CommandError(f"{len(matches)} group chats match {options['chat']!r}; use the guid from --list")
        guid = matches[0][0]

        sender = local_imessage.LocalMessages()
        seen = local_imessage.last_rowid()
        self.stdout.write(f"Watching {matches[0][1] or guid}. Ctrl-C to stop.")
        while True:
            for new in local_imessage.fetch_new(guid, seen):
                seen = new["rowid"]
                if new["is_bot"] or not new["text"]:
                    continue
                message, created = ChatMessage.objects.get_or_create(
                    guid=new["guid"],
                    defaults={"chat_guid": guid, "handle": new["handle"], "sent_at": new["sent_at"],
                              "text": new["text"]},
                )
                if created:
                    self.stdout.write(f"{new['handle']}: {new['text']}")
                    try:
                        handle_message(message, chat=sender)
                    except Exception as error:  # keep watching; `process_pending` won't resend locally
                        self.stderr.write(f"failed on {new['guid']}: {error}")
            time.sleep(options["interval"])
