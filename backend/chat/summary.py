"""
Competition stats (from the ORM) and the end-of-competition PNG card.

"""
import io
import math
from zoneinfo import ZoneInfo

from django.conf import settings
from django.utils import timezone

from competitions.models import Goal, GoalUpdate


def local_date(dt=None):
    return (dt or timezone.now()).astimezone(ZoneInfo(settings.BOOTS_TIMEZONE)).date()


def _goal_pct(goal, updates, days):
    """Fraction of a goal that was met over `days`, given its active updates."""
    if goal.cadence == Goal.Cadence.TOTAL:
        if goal.target:
            return min(1.0, sum(u.value or 0 for u in updates) / goal.target)
        return 1.0 if any(u.met for u in updates) else 0.0
    if goal.cadence == Goal.Cadence.WEEKLY:
        weeks = [days[i:i + 7] for i in range(0, len(days), 7)]
        hit = 0
        for week in weeks:
            in_week = [u for u in updates if u.for_date in week]
            if goal.target:
                hit += sum(u.value or 0 for u in in_week) >= goal.target
            else:
                hit += any(u.met for u in in_week)
        return hit / len(weeks)
    met_days = {u.for_date for u in updates if u.met}
    return len(met_days & set(days)) / len(days)


def compute_stats(competition, today=None):
    """
    Leaderboard + day-by-day grid for a competition. Also saves Participant.score (0-100).

    """
    today = today or local_date()
    start = local_date(competition.start_date)
    end = min(local_date(competition.end_date), today)
    days = [start + timezone.timedelta(days=i) for i in range(max((end - start).days, 0) + 1)]

    rows = []
    for participant in competition.participants.all():
        goals = list(participant.goals.select_related('category'))
        if not goals:
            continue
        updates = list(GoalUpdate.objects.filter(goal__in=goals, superseded_by__isnull=True, for_date__in=days))
        goal_rows = []
        for goal in goals:
            pct = _goal_pct(goal, [u for u in updates if u.goal_id == goal.id], days)
            goal_rows.append({"category": goal.category.name, "description": goal.description, "pct": pct})
        grid = []
        for day in days:
            met = {u.goal_id for u in updates if u.for_date == day and u.met}
            grid.append(len(met) / len(goals))
        pct = sum(g["pct"] for g in goal_rows) / len(goal_rows)
        participant.score = round(pct * 100)
        participant.save(update_fields=["score"])
        rows.append({"name": participant.name, "pct": pct, "goals": goal_rows, "grid": grid})

    rows.sort(key=lambda r: (-r["pct"], r["name"]))
    return {
        "name": competition.name,
        "start": start,
        "end": end,
        "days": days,
        "rows": rows,
        "winner": rows[0]["name"] if rows and rows[0]["pct"] > 0 else None,
    }


def leaderboard_text(stats):
    if not stats["rows"]:
        return f"{stats['name']}: nobody has set a goal yet."
    lines = [f"{stats['name']} — day {len(stats['days'])}"]
    for rank, row in enumerate(stats["rows"], 1):
        lines.append(f"{rank}. {row['name']} — {round(row['pct'] * 100)}%")
    return "\n".join(lines)


INK, MUTED, SURFACE = "#1a1a1a", "#6b6b6b", "#ffffff"
BAR, BAR_WINNER, TRACK = "#9db8e8", "#1f4fb3", "#eef0f3"


def render_card(stats):
    """1080x1350 PNG: leaderboard of % goals met plus a day-by-day hit/miss grid."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap

    rows, days = stats["rows"], stats["days"]
    n = max(len(rows), 1)
    fig = plt.figure(figsize=(10.8, 13.5), dpi=100, facecolor=SURFACE)
    fig.text(0.07, 0.945, stats["name"], fontsize=40, fontweight="bold", color=INK, va="top")
    fig.text(0.07, 0.895, f"{stats['start']:%b %-d} – {stats['end']:%b %-d, %Y} · {len(days)} days",
             fontsize=18, color=MUTED, va="top")
    if stats["winner"]:
        fig.text(0.07, 0.855, f"Winner: {stats['winner']}", fontsize=24, fontweight="bold", color=INK, va="top")

    # leaderboard
    ax = fig.add_axes([0.07, 0.46, 0.86, 0.32])
    names = [r["name"] for r in rows]
    pcts = [r["pct"] * 100 for r in rows]
    y = range(n)
    ax.barh(y, [100] * len(rows), color=TRACK, height=0.55)
    ax.barh(y, pcts, color=[BAR_WINNER if r["name"] == stats["winner"] else BAR for r in rows], height=0.55)
    for i, (name, pct) in enumerate(zip(names, pcts)):
        ax.text(0, i - 0.42, name, fontsize=17, color=INK, va="center")
        ax.text(100, i - 0.42, f"{round(pct)}%", fontsize=17, color=INK, va="center", ha="right", fontweight="bold")
    ax.set_xlim(0, 100)
    ax.set_ylim(n - 0.5, -0.8)
    ax.axis("off")
    fig.text(0.07, 0.795, "GOALS MET", fontsize=13, color=MUTED)

    # day-by-day grid
    fig.text(0.07, 0.415, "DAY BY DAY", fontsize=13, color=MUTED)
    gax = fig.add_axes([0.07, 0.07, 0.86, 0.33])
    width, height, label_w = 929, 445, 170  # axes size in px
    cols = max(len(days), 1)
    cell_w = min((width - label_w) / cols, 90)
    cell_h = min((height - 30) / n, 70)
    cmap = LinearSegmentedColormap.from_list("hits", [TRACK, BAR, BAR_WINNER])
    for r, row in enumerate(rows):
        top = height - r * cell_h
        gax.text(0, top - cell_h / 2, row["name"], fontsize=15, color=INK, va="center")
        for c, value in enumerate(row["grid"]):
            gax.add_patch(plt.Rectangle((label_w + c * cell_w, top - cell_h + 3), cell_w - 3, cell_h - 3,
                                        color=cmap(float(value)), linewidth=0))
    step = max(1, math.ceil(cols / 10))
    for c in range(0, cols, step):
        gax.text(label_w + c * cell_w + cell_w / 2, height - n * cell_h - 6, f"{days[c]:%-d}", fontsize=11,
                 color=MUTED, ha="center", va="top")
    gax.set_xlim(0, width)
    gax.set_ylim(0, height)
    gax.axis("off")
    fig.text(0.07, 0.04, "Darker = more of that day's goals hit", fontsize=12, color=MUTED)

    buf = io.BytesIO()
    fig.savefig(buf, format="png", facecolor=SURFACE)
    plt.close(fig)
    return buf.getvalue()
