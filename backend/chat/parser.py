"""
Turns a free-text group chat message into goals / daily updates using Claude.

"""
from typing import List, Literal, Optional

import anthropic
from django.conf import settings
from pydantic import BaseModel

SYSTEM = """You read messages from a group chat where friends run a self-improvement competition, and extract structured data for the scorekeeper.

Classify the message as one of:
- goal_set: the sender commits to a goal for the competition ("my goal is to run 5km every day", "I'll read 20 pages a day").
- daily_update: the sender reports how they did against one of their existing goals ("ran 5.2k this morning", "up at 6:10", "skipped the gym").
- chatter: anything else, including banter, questions, and reports about goals the sender has not set. When in doubt, choose chatter with low confidence.

For goals: pick the category from the provided list when one fits, otherwise invent a short new category name. metric is the unit ("km", "pages", "wake time", "bool" for yes/no goals). target is the number to hit (wake-up times as decimal hours, 6:30 -> 6.5), or null for yes/no goals. cadence is how often the target applies.

For updates: category must be the category of one of the sender's existing goals. value is the number reported, in the goal's metric, or null. met says whether the sender hit that goal for that day, judged against the goal's target (for wake-up or limit-style goals, lower is better). for_date is the day the update is about, YYYY-MM-DD; use today's date unless the message says otherwise ("yesterday").

One message can contain several goals or several updates. Leave the unused list empty. confidence is 0-1."""


class ParsedGoal(BaseModel):
    category: str
    description: str
    metric: str
    target: Optional[float]
    cadence: Literal["daily", "weekly", "total"]


class ParsedUpdate(BaseModel):
    category: str
    value: Optional[float]
    met: bool
    for_date: str
    note: str


class ParseResult(BaseModel):
    kind: Literal["goal_set", "daily_update", "chatter"]
    goals: List[ParsedGoal]
    updates: List[ParsedUpdate]
    confidence: float


def parse_message(text, *, sender, today, competition, categories, sender_goals, recent):
    """
    text: the message. sender: display name. today: date in the group's timezone.
    categories: list of names. sender_goals: Goal queryset. recent: list of (name, text).
    """
    goals = "\n".join(
        f"- [{g.category.name}] {g.description} (metric: {g.metric or 'n/a'}, target: {g.target}, {g.cadence})"
        for g in sender_goals
    ) or "(none yet)"
    history = "\n".join(f"{name}: {body}" for name, body in recent) or "(none)"
    prompt = f"""Competition: {competition.name}
Today: {today.isoformat()} ({today.strftime('%A')})
Categories: {', '.join(categories)}

{sender}'s current goals:
{goals}

Recent messages:
{history}

New message from {sender}:
{text}"""
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    response = client.messages.parse(
        model=settings.BOOTS_PARSER_MODEL,
        max_tokens=1024,
        system=SYSTEM,
        messages=[{"role": "user", "content": prompt}],
        output_format=ParseResult,
    )
    return response.parsed_output
