# Automation Flows

## 1. Purpose
Maps the invisible, background processes that happen without direct human interaction. It documents triggers, cron jobs, database webhooks, and asynchronous side-effects.

## 2. Why It Matters
"Magic" is dangerous in software. If an invoice is generated automatically at midnight, but no one knows *where* that code lives, debugging a billing error becomes impossible. This file makes the magic visible.

## 3. Example Structure
- **Automation Name**: What the robot does.
- **Trigger**: What sets it off (Time-based vs Event-based).
- **Execution Layer**: Where the code lives (Edge Function, Postgres Trigger).
- **Failure Mode**: What happens if it fails.

## 4. Example Content
**Automation: Post-Match ELO Calculation**
- *Trigger*: Event-based. When `battles` table `status` updates to `finished`.
- *Execution*: Postgres Webhook triggers Deno Edge Function `calculate-elo`.
- *Failure Mode*: If the function fails, it retries 3 times. If it fails permanently, the match is flagged `status = 'error_calculating'` for manual review.

**Automation: Nightly Leaderboard Decay**
- *Trigger*: Time-based. Cron job runs every night at 00:00 UTC.
- *Execution*: Supabase pg_cron triggers a stored procedure `decay_inactive_elo()`.
- *Failure Mode*: Silent failure. It will simply attempt again the next night.

## 5. AI Usage Instructions
> [!CAUTION]  
> When an AI agent proposes a new feature that requires a background task, it MUST document it here. It should prefer Event-based triggers (Webhooks) over Time-based triggers (Polling/Cron) to reduce database load.

## 6. Developer Usage Instructions
- Never write `setInterval` or `setTimeout` on the frontend to handle critical business logic. If the user closes the tab, the automation fails. Automations must run on the server.
- Ensure all automations are idempotent (safe to run twice accidentally).

## 7. Best Practices
- **Do**: Log the start and end of every automation in an `audit_logs` table.
- **Don't**: Chain automations together deeply (e.g., Automation A triggers B, which triggers C). Keep flows flat to prevent infinite loops.

## 8. Maintenance Strategy
- **Owner**: Backend Lead / DevOps.
- **Update Frequency**: Every sprint.
- **Trigger**: Introduction of new async background workers or cron schedules.
