from django.db import models


class ChatMessage(models.Model):
    """
    A raw iMessage received from (or sent by) the bot's account via BlueBubbles.

    """
    guid = models.CharField(max_length=255, unique=True)  # BlueBubbles message guid
    chat_guid = models.CharField(max_length=255, db_index=True)
    handle = models.CharField(max_length=255, blank=True)
    sent_at = models.DateTimeField()
    text = models.TextField(blank=True)
    is_from_me = models.BooleanField(default=False)
    parsed_kind = models.CharField(max_length=20, blank=True)
    parse_json = models.JSONField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['sent_at', 'id']

    def __str__(self):
        return f"{self.handle or 'me'}: {self.text[:40]}"
