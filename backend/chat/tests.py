import datetime
import json

from django.test import TestCase, override_settings
from django.utils import timezone

from chat.agent import finish_competition, handle_message
from chat.imessage import FakeChat
from chat.models import ChatMessage
from chat.parser import ParseResult
from chat.summary import compute_stats, render_card
from competitions.models import Category, Competition, Goal, GoalUpdate, Participant

CHAT = "iMessage;+;chat1"
NOW = datetime.datetime(2026, 10, 2, 15, 0, tzinfo=datetime.timezone.utc)


def goal_set(**goal):
    return ParseResult(kind="goal_set", goals=[goal], updates=[], confidence=0.9)


def update(confidence=0.9, **fields):
    fields = {"note": "", "for_date": "2026-10-02", **fields}
    return ParseResult(kind="daily_update", goals=[], updates=[fields], confidence=confidence)


RUN = {"category": "Workout", "description": "Run 5km", "metric": "km", "target": 5, "cadence": "daily"}


class AgentTests(TestCase):
    def setUp(self):
        Category.objects.create(name="Workout", public=True)
        self.chat = FakeChat()
        self.count = 0

    def say(self, text, handle="+15550001", result=None, sent_at=NOW):
        self.count += 1
        message = ChatMessage.objects.create(
            guid=f"m{self.count}", chat_guid=CHAT, handle=handle, sent_at=sent_at, text=text
        )
        self.parser_calls = 0

        def parser(*args, **kwargs):
            self.parser_calls += 1
            return result

        handle_message(message, chat=self.chat, parser=parser)
        return message

    def start(self):
        self.say('boots start "Oct Grind" 30d')
        return Competition.objects.get()

    def test_start_creates_competition(self):
        competition = self.start()
        self.assertEqual(competition.name, "Oct Grind")
        self.assertEqual(competition.chat_guid, CHAT)
        self.assertEqual(self.parser_calls, 0)
        self.assertIn("30 days", self.chat.sent[-1]["text"])
        self.say('boots start "Another" 5d')
        self.assertEqual(Competition.objects.count(), 1)

    def test_chatter_without_competition_skips_parser(self):
        message = self.say("anyone up for lunch")
        self.assertEqual(self.parser_calls, 0)
        self.assertEqual(message.parsed_kind, "chatter")
        self.assertEqual(self.chat.sent, [])

    def test_goal_then_update_then_correction(self):
        self.start()
        self.say("boots name Callum")
        self.say("my goal is to run 5km a day", result=goal_set(**RUN))
        goal = Goal.objects.get()
        self.assertEqual((goal.target, goal.cadence, goal.participant.name), (5, "daily", "Callum"))

        self.say("ran 4k", result=update(category="Workout", value=4, met=False))
        self.say("sorry, 5.2k", result=update(category="Workout", value=5.2, met=True))
        first, second = GoalUpdate.objects.order_by("id")
        self.assertEqual(first.superseded_by, second)
        self.assertIsNone(second.superseded_by)
        self.assertIn("✅ Callum — Workout 5.2 km", self.chat.sent[-1]["text"])

    def test_low_confidence_and_unknown_goal_write_nothing(self):
        self.start()
        self.say("maybe ran?", result=update(confidence=0.3, category="Workout", value=5, met=True))
        self.say("read 20 pages", result=update(category="Reading", value=20, met=True))
        self.assertEqual(GoalUpdate.objects.count(), 0)

    def test_new_category_is_private(self):
        competition = self.start()
        self.say("no sugar", result=goal_set(category="Sugar", description="No sugar", metric="bool",
                                             target=None, cadence="daily"))
        category = competition.categories.get(name="Sugar")
        self.assertFalse(category.public)

    def test_status_and_end(self):
        competition = self.start()
        Competition.objects.update(start_date=NOW - datetime.timedelta(days=1))
        competition.refresh_from_db()
        self.say("goal", result=goal_set(**RUN))
        self.say("goal", handle="+15550002", result=goal_set(**RUN))
        self.say("ran", result=update(category="Workout", value=5, met=True, for_date="2026-10-01"))
        self.say("ran", result=update(category="Workout", value=6, met=True))
        self.say("skipped", handle="+15550002", result=update(category="Workout", value=None, met=False))

        stats = compute_stats(competition, today=datetime.date(2026, 10, 2))
        self.assertEqual([round(r["pct"], 2) for r in stats["rows"]], [1.0, 0.0])
        self.assertEqual(stats["rows"][0]["grid"], [1.0, 1.0])
        self.assertEqual(Participant.objects.get(handle="+15550001").score, 100)

        finish_competition(competition, chat=self.chat, recap=lambda stats: "recap")
        sent = self.chat.sent[-1]
        self.assertEqual(sent["text"], "recap")
        self.assertTrue(sent["image"].startswith(b"\x89PNG"))
        competition.refresh_from_db()
        self.assertIsNotNone(competition.summary_sent_at)
        # the chat is free for a new competition
        self.say('boots start "Nov" 7d')
        self.assertEqual(Competition.objects.count(), 2)

    def test_weekly_and_total_goals(self):
        competition = self.start()
        Competition.objects.update(start_date=NOW - datetime.timedelta(days=9))
        competition.refresh_from_db()
        self.say("goal", result=goal_set(category="Workout", description="100km total", metric="km",
                                         target=100, cadence="total"))
        self.say("ran", result=update(category="Workout", value=25, met=True))
        stats = compute_stats(competition, today=datetime.date(2026, 10, 2))
        self.assertEqual(stats["rows"][0]["pct"], 0.25)
        Goal.objects.update(cadence="weekly", target=20)
        stats = compute_stats(competition, today=datetime.date(2026, 10, 2))
        self.assertEqual(stats["rows"][0]["pct"], 0.5)  # second of two weeks hit


@override_settings(BOOTS_WEBHOOK_TOKEN="secret", BLUEBUBBLES_URL="http://bb.invalid")
class WebhookTests(TestCase):
    def post(self, payload, token="secret"):
        return self.client.post(f"/chat/webhook/?token={token}", json.dumps(payload), content_type="application/json")

    def payload(self, **data):
        return {"type": "new-message", "data": {
            "guid": "g1", "text": "hello", "isFromMe": False, "dateCreated": 1790953200000,
            "handle": {"address": "+15550001"}, "chats": [{"guid": CHAT}], **data}}

    def test_rejects_bad_token(self):
        self.assertEqual(self.post(self.payload(), token="nope").status_code, 403)
        self.assertEqual(ChatMessage.objects.count(), 0)

    def test_stores_message_once(self):
        self.assertEqual(self.post(self.payload()).status_code, 200)
        self.assertEqual(self.post(self.payload()).status_code, 200)
        message = ChatMessage.objects.get()
        self.assertEqual((message.handle, message.chat_guid, message.parsed_kind), ("+15550001", CHAT, "chatter"))

    def test_ignores_other_events(self):
        self.assertEqual(self.post({"type": "typing-indicator", "data": {}}).status_code, 200)
        self.assertEqual(ChatMessage.objects.count(), 0)
