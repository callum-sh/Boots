"""
The agent: takes one stored ChatMessage, updates the competition, replies in the chat.

"""
import datetime
import logging
import re

import anthropic
from django.conf import settings
from django.utils import timezone

from chat.imessage import BlueBubbles
from chat.models import ChatMessage
from chat.parser import parse_message
from chat.summary import compute_stats, leaderboard_text, local_date, render_card
from competitions.models import Category, Competition, Goal, GoalUpdate, Participant

logger = logging.getLogger(__name__)

MIN_CONFIDENCE = 0.6
HELP = """boots start "Name" 30d — start a competition in this chat
boots status — leaderboard so far
boots end — end it and post the summary
boots name <your name> — set how you appear
Otherwise just say your goals and how each day went."""


def active_competition(chat_guid):
    return Competition.objects.filter(chat_guid=chat_guid, summary_sent_at__isnull=True).order_by('-start_date').first()


def get_participant(competition, handle):
    participant, _ = Participant.objects.get_or_create(competition=competition, handle=handle)
    return participant


def handle_message(message, chat=None, parser=parse_message):
    """Process one ChatMessage. Safe to call again: already-processed messages are skipped."""
    if message.processed_at:
        return
    chat = chat or BlueBubbles()
    text = message.text.strip()
    if message.is_from_me or not text:
        kind = "ignored"
    elif re.match(r"boots\b", text, re.I):
        kind = "command"
        reply = run_command(message, text, chat)
        if reply:
            chat.send(message.chat_guid, reply)
    else:
        kind = handle_free_text(message, text, chat, parser)
    message.parsed_kind = kind
    message.processed_at = timezone.now()
    message.save(update_fields=["parsed_kind", "parse_json", "processed_at"])


def run_command(message, text, chat):
    args = text.split(None, 2)[1:]
    command = args[0].lower() if args else "help"
    rest = args[1].strip() if len(args) > 1 else ""
    competition = active_competition(message.chat_guid)

    if command == "start":
        if competition:
            return f"{competition.name} is already running. Send 'boots end' first."
        match = re.match(r"""["“']?(.+?)["”']?\s+(\d+)\s*d(?:ays?)?$""", rest, re.I)
        if not match:
            return 'Usage: boots start "Oct Grind" 30d'
        name, days = match.group(1), int(match.group(2))
        competition = Competition.objects.create(
            name=name, chat_guid=message.chat_guid,
            end_date=timezone.now() + timezone.timedelta(days=days),
        )
        competition.categories.set(Category.objects.filter(public=True))
        return f"{name} is on for {days} days. Tell me your goals, then check in each day."

    if command == "help":
        return HELP
    if not competition:
        return 'No competition running here. Start one with: boots start "Name" 30d'

    if command == "status":
        return leaderboard_text(compute_stats(competition))
    if command == "end":
        finish_competition(competition, chat)
        return None
    if command == "name":
        if not rest:
            return "Usage: boots name Callum"
        participant = get_participant(competition, message.handle)
        participant.display_name = rest[:100]
        participant.save(update_fields=["display_name"])
        return f"Got it, {participant.display_name}."
    return HELP


def handle_free_text(message, text, chat, parser):
    competition = active_competition(message.chat_guid)
    if not competition:
        return "chatter"
    participant = get_participant(competition, message.handle)
    today = local_date(message.sent_at)
    names = {
        p.handle: p.name for p in competition.participants.all()
    }
    recent = [
        ("Boots" if m.is_from_me else names.get(m.handle, m.handle), m.text)
        for m in reversed(ChatMessage.objects.filter(chat_guid=message.chat_guid, sent_at__lt=message.sent_at)
                          .exclude(text="").order_by('-sent_at')[:6])
    ]
    result = parser(
        text, sender=participant.name, today=today, competition=competition,
        categories=list(competition.categories.values_list('name', flat=True)),
        sender_goals=participant.goals.select_related('category'), recent=recent,
    )
    message.parse_json = result.model_dump()
    if result.kind == "chatter" or result.confidence < MIN_CONFIDENCE:
        return "chatter"

    lines = []
    if result.kind == "goal_set":
        for parsed in result.goals:
            category = competition.categories.filter(name__iexact=parsed.category).first()
            if not category:
                category = Category.objects.create(name=parsed.category[:100], public=False)
                competition.categories.add(category)
            Goal.objects.update_or_create(
                participant=participant, category=category,
                defaults={
                    "description": parsed.description[:255], "metric": parsed.metric[:50],
                    "target": parsed.target, "cadence": parsed.cadence, "source_message": message,
                },
            )
            lines.append(f"🎯 {participant.name} — {category.name}: {parsed.description} ({parsed.cadence})")
    else:
        for parsed in result.updates:
            goal = participant.goals.filter(category__name__iexact=parsed.category).first()
            if not goal:
                continue
            try:
                for_date = datetime.date.fromisoformat(parsed.for_date)
            except ValueError:
                for_date = today
            update = GoalUpdate.objects.create(
                goal=goal, participant=participant, for_date=for_date, value=parsed.value,
                met=parsed.met, note=parsed.note[:255], source_message=message,
            )
            # a correction: keep the old rows, point them at the new one
            GoalUpdate.objects.filter(goal=goal, for_date=for_date, superseded_by__isnull=True) \
                .exclude(pk=update.pk).update(superseded_by=update)
            value = f" {parsed.value:g} {goal.metric}".rstrip() if parsed.value is not None else ""
            when = "" if for_date == today else f" ({for_date:%b %-d})"
            lines.append(f"{'✅' if parsed.met else '❌'} {participant.name} — {goal.category.name}{value}{when}")
    if lines:
        chat.send(message.chat_guid, "\n".join(lines))
    return result.kind


def write_recap(stats):
    """2-3 lines from Claude, built only from computed stats. Falls back to plain text."""
    winner = stats["winner"]
    fallback = (f"{stats['name']} is done. {winner} takes it." if winner else f"{stats['name']} is done.") \
        + "\n" + "\n".join(leaderboard_text(stats).split("\n")[1:])
    facts = "\n".join(
        f"{r['name']}: {round(r['pct'] * 100)}% overall; "
        + "; ".join(f"{g['description']} {round(g['pct'] * 100)}%" for g in r["goals"])
        for r in stats["rows"]
    )
    try:
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        response = client.messages.create(
            model=settings.BOOTS_RECAP_MODEL,
            max_tokens=2000,
            output_config={"effort": "low"},
            system="You write the end-of-competition recap for a group chat of friends. 2-3 short lines, "
                   "plain text, friendly with a little ribbing. Use only the numbers given; never invent stats.",
            messages=[{"role": "user", "content":
                       f"Competition: {stats['name']} ({len(stats['days'])} days)\nWinner: {winner}\n{facts}"}],
        )
        text = "".join(b.text for b in response.content if b.type == "text").strip()
        if response.stop_reason == "end_turn" and text:
            return text
    except anthropic.APIError:
        logger.exception("recap failed, using fallback")
    return fallback


def finish_competition(competition, chat=None, recap=write_recap):
    chat = chat or BlueBubbles()
    stats = compute_stats(competition)
    if stats["rows"]:
        chat.send(competition.chat_guid, text=recap(stats), image=render_card(stats))
    else:
        chat.send(competition.chat_guid, text=f"{competition.name} is over. Nobody set a goal.")
    competition.summary_sent_at = timezone.now()
    competition.save(update_fields=["summary_sent_at"])
