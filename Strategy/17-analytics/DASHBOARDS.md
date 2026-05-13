# Dashboards & Telemetry

## 1. Purpose
Defines how internal teams visualize system health, errors, and user behavior. It provides the visual layout of the command center used by DevOps and Product.

## 2. Why It Matters
If the database CPU hits 99%, but no dashboard shows it and no alert fires, the system goes down silently. This document ensures observability is a first-class citizen in the architecture.

## 3. Example Structure
- **Operational Dashboards**: System health (DevOps).
- **Product Dashboards**: User behavior (PMs).
- **Alerting Thresholds**: When to wake someone up.

## 4. Example Content
**Operational Dashboards (Supabase / Datadog)**:
- *Database CPU & RAM*: Primary gauge of systemic load.
- *Realtime Concurrent Connections*: Must stay below the plan's maximum threshold.
- *Edge Function Error Rate*: Spike in 500s indicates a broken third-party API or bad deployment.

**Product Dashboards (PostHog)**:
- *Matchmaking Funnel*: `Clicked Find Match` -> `Matched` -> `Completed Battle`.
- *Retention Cohort*: Showing if users who sign up in Week 1 are still playing in Week 4.

**Alerting Thresholds (PagerDuty / Slack)**:
- *Critical (Wake up)*: Production database unreachable, or Matchmaking API error rate > 5% for 5 minutes.
- *Warning (Slack Message)*: Concurrent connections reach 80% of the Supabase limit.

## 5. AI Usage Instructions
> [!WARNING]  
> If an AI agent creates a new Edge Function, it MUST ensure that errors are caught and logged properly so they appear on the Operational Dashboards. `console.error` is the minimum requirement; `Sentry.captureException` is preferred.

## 6. Developer Usage Instructions
- Do not mute alerts without addressing the root cause.
- Check the Product Dashboards a few days after releasing a feature to see if users are actually clicking the button you built.

## 7. Best Practices
- **Do**: Keep operational dashboards clean. Remove noisy metrics that no one acts upon.
- **Don't**: Allow alert fatigue. If a Slack channel has 500 unread automated alerts, the thresholds are too low.

## 8. Maintenance Strategy
- **Owner**: DevOps / Data Analyst.
- **Update Frequency**: Every quarter.
- **Trigger**: System outages that were not caught by existing alerts.
