"""
BlueBubbles client: the Mac relay that actually talks iMessage.

Incoming messages arrive on the webhook (chat/views.py); this module only sends.
"""
import uuid

import requests
from django.conf import settings


class BlueBubbles:
    def __init__(self, url=None, password=None):
        self.url = (url or settings.BLUEBUBBLES_URL).rstrip('/')
        self.password = password or settings.BLUEBUBBLES_PASSWORD

    def _post(self, path, **kwargs):
        response = requests.post(
            f"{self.url}/api/v1/{path}", params={"password": self.password}, timeout=30, **kwargs
        )
        response.raise_for_status()
        return response

    def send(self, chat_guid, text=None, image=None):
        """
        Send text and/or a PNG (bytes) to a chat. The image goes first.

        """
        if image:
            self._post(
                "message/attachment",
                data={"chatGuid": chat_guid, "tempGuid": str(uuid.uuid4()), "name": "boots.png"},
                files={"attachment": ("boots.png", image, "image/png")},
            )
        if text:
            self._post(
                "message/text",
                json={"chatGuid": chat_guid, "tempGuid": str(uuid.uuid4()), "message": text, "method": "apple-script"},
            )


class FakeChat:
    """Records what would have been sent. Used by tests and `simulate_chat`."""

    def __init__(self):
        self.sent = []

    def send(self, chat_guid, text=None, image=None):
        self.sent.append({"chat_guid": chat_guid, "text": text, "image": image})
