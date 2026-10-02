import datetime
import hmac
import json
import logging

from django.conf import settings
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from chat.agent import handle_message
from chat.models import ChatMessage

logger = logging.getLogger(__name__)


@csrf_exempt
@require_POST
def webhook(request):
    """
    BlueBubbles webhook. Configure it on the Mac as
    https://<host>/chat/webhook/?token=<BOOTS_WEBHOOK_TOKEN> with the "New Messages" event.

    """
    token = settings.BOOTS_WEBHOOK_TOKEN
    if not token or not hmac.compare_digest(request.GET.get("token", ""), token):
        return HttpResponseForbidden()
    try:
        payload = json.loads(request.body)
        data = payload.get("data") or {}
    except (ValueError, AttributeError):
        return HttpResponse(status=400)
    chats = data.get("chats") or []
    if payload.get("type") != "new-message" or not data.get("guid") or not chats:
        return JsonResponse({"ok": True, "ignored": True})

    created_ms = data.get("dateCreated")
    message, created = ChatMessage.objects.get_or_create(
        guid=data["guid"],
        defaults={
            "chat_guid": chats[0].get("guid", ""),
            "handle": (data.get("handle") or {}).get("address", ""),
            "sent_at": datetime.datetime.fromtimestamp(created_ms / 1000, datetime.timezone.utc)
            if created_ms else timezone.now(),
            "text": data.get("text") or "",
            "is_from_me": bool(data.get("isFromMe")),
        },
    )
    if created:
        try:
            handle_message(message)
        except Exception:  # the message is stored; `process_pending` retries it
            logger.exception("failed to process message %s", message.guid)
    return JsonResponse({"ok": True})
