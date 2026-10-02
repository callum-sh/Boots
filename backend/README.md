
## iMessage agent (`chat` app)

A group chat runs a competition by texting a bot account. A Mac running
[BlueBubbles](https://bluebubbles.app) relays messages; everything else lives here.

```
iMessage -> BlueBubbles (Mac) -> POST /chat/webhook/?token=... -> ChatMessage
   -> "boots ..." command, or Claude parser -> Goal / GoalUpdate -> confirmation via BlueBubbles REST
competition ends -> stats from the ORM -> PNG card + recap -> BlueBubbles REST
```

In the chat:

```
boots start "Oct Grind" 30d
boots status
boots end
boots name Callum
```

Anything else is read by Claude as a goal ("I'll run 5km a day"), a check-in ("ran 5.2k"), or chatter.

### Settings (env vars / `fly secrets`)

| Var | What |
| --- | --- |
| `ANTHROPIC_API_KEY` | Claude key |
| `BLUEBUBBLES_URL` | Public URL of the BlueBubbles server (its Cloudflare/ngrok tunnel) |
| `BLUEBUBBLES_PASSWORD` | BlueBubbles server password |
| `BOOTS_WEBHOOK_TOKEN` | Random string; the webhook rejects requests without `?token=` matching it |
| `BOOTS_TIMEZONE` | Timezone of the group, e.g. `America/Toronto` |
| `DJANGO_SECRET_KEY`, `DATABASE_URL`, `DJANGO_ALLOWED_HOSTS` | As before |

### Deploy to Fly.io

```bash
cd backend
fly launch --no-deploy --copy-config
fly postgres create && fly postgres attach <pg-app>      # sets DATABASE_URL
fly secrets set DJANGO_SECRET_KEY=... ANTHROPIC_API_KEY=... BLUEBUBBLES_URL=... \
  BLUEBUBBLES_PASSWORD=... BOOTS_WEBHOOK_TOKEN=...
fly deploy
```

Then in BlueBubbles on the Mac: Settings -> API & Webhooks -> add
`https://<app>.fly.dev/chat/webhook/?token=<BOOTS_WEBHOOK_TOKEN>` with the "New Messages" event.

Competitions that hit their end date are closed by a daily job:

```bash
fly machine run . --schedule daily -- python manage.py end_due_competitions
```

`python manage.py process_pending` retries messages that were stored but failed to process.

### Tests

```bash
DEVELOPMENT_MODE=True python manage.py test
```

### Run locally without BlueBubbles

`simulate_chat` is a fake group chat in the terminal (type `name: message`).

`run_local_imessage` runs the agent against one group chat in this Mac's Messages app, reading
`chat.db` and replying with AppleScript. Replies come from whoever is signed in to Messages and are
prefixed with 🥾. The terminal needs Full Disk Access.

```bash
DEVELOPMENT_MODE=True python manage.py run_local_imessage --list
DEVELOPMENT_MODE=True python manage.py run_local_imessage --chat "Boots test"
```
