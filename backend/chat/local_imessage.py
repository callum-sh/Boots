"""
Local variant: read this Mac's Messages database and send with AppleScript.

Runs as whoever is signed in to Messages, so replies come from that account. Each reply
starts with BOT_PREFIX so the poller can tell the bot's messages from the owner's.
Needs Full Disk Access (to read chat.db) and Automation permission for Messages (to send).
"""
import datetime
import os
import sqlite3
import subprocess

DB = os.path.expanduser("~/Library/Messages/chat.db")
BOT_PREFIX = "🥾 "
APPLE_EPOCH = datetime.datetime(2001, 1, 1, tzinfo=datetime.timezone.utc)


def _connect():
    return sqlite3.connect(f"file:{DB}?mode=ro", uri=True)


def _decode_attributed_body(blob):
    """Recent macOS leaves message.text NULL and puts the text in a typedstream blob."""
    try:
        part = blob.split(b"NSString")[1][5:]
        if part[0] == 0x81:
            length, start = int.from_bytes(part[1:3], "little"), 3
        else:
            length, start = part[0], 1
        return part[start:start + length].decode("utf-8", "replace")
    except (IndexError, AttributeError):
        return ""


def list_group_chats():
    """(guid, display name, participant handles) for every group chat."""
    with _connect() as db:
        rows = db.execute(
            """select c.guid, c.display_name, group_concat(h.id, ', ')
               from chat c join chat_handle_join chj on chj.chat_id = c.ROWID
               join handle h on h.ROWID = chj.handle_id
               group by c.ROWID having count(*) > 1 order by c.ROWID desc"""
        ).fetchall()
    return rows


def last_rowid():
    with _connect() as db:
        return db.execute("select coalesce(max(ROWID), 0) from message").fetchone()[0]


def fetch_new(chat_guid, after_rowid):
    """New messages in one chat as dicts, oldest first. Tapbacks and the bot's own replies are skipped."""
    with _connect() as db:
        rows = db.execute(
            """select m.ROWID, m.guid, m.text, m.attributedBody, m.is_from_me, m.date, h.id
               from message m join chat_message_join cmj on cmj.message_id = m.ROWID
               join chat c on c.ROWID = cmj.chat_id left join handle h on h.ROWID = m.handle_id
               where c.guid = ? and m.ROWID > ? and m.associated_message_type = 0
               order by m.ROWID""",
            (chat_guid, after_rowid),
        ).fetchall()
    messages = []
    for rowid, guid, text, body, is_from_me, date, handle in rows:
        text = text or (_decode_attributed_body(body) if body else "")
        messages.append({
            "rowid": rowid, "guid": guid, "text": text.replace("￼", "").strip(),
            "is_bot": bool(is_from_me) and text.startswith(BOT_PREFIX),
            "handle": "me" if is_from_me else (handle or ""),
            "sent_at": APPLE_EPOCH + datetime.timedelta(seconds=date / 1e9),
        })
    return messages


class LocalMessages:
    """Sends through Messages.app. Same interface as BlueBubbles."""

    def _run(self, chat_guid, what, value):
        script = f'on run argv\ntell application "Messages" to send {what} to chat id (item 1 of argv)\nend run'
        subprocess.run(["osascript", "-e", script, chat_guid, value], check=True, capture_output=True, text=True)

    def send(self, chat_guid, text=None, image=None):
        if image:
            # Messages can't read attachments from temp directories
            path = os.path.expanduser("~/Pictures/boots-card.png")
            with open(path, "wb") as f:
                f.write(image)
            self._run(chat_guid, "(POSIX file (item 2 of argv))", path)
        if text:
            self._run(chat_guid, "(item 2 of argv)", BOT_PREFIX + text)
