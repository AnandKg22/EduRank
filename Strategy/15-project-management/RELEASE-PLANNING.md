# Release Planning

## 1. Purpose
Governs the strategy for launching features to the user base. It details how to mitigate risk during a rollout and how to announce the changes.

## 2. Why It Matters
Deploying code is easy. Releasing a feature safely is hard. If a massive new matchmaking engine is released to 100% of users at once and it fails, the platform crashes. Release planning ensures safe, phased rollouts.

## 3. Example Structure
- **Release Strategies**: Feature Flags, Canary, Blue/Green.
- **Go-to-Market (GTM)**: How we tell users.
- **Post-Release Monitoring**: What we watch after hitting "Deploy".

## 4. Example Content
**Release Strategies**:
- *Feature Flags*: All major new UI components or workflows must be hidden behind a Feature Flag (e.g., using PostHog or a Supabase settings table).
- *Phased Rollout*: 
  1. Internal Team (100% Admin access).
  2. Beta Testers (10% of Student base).
  3. General Availability (100% of users).

**Post-Release Monitoring**:
- For the first 24 hours after a major release, the primary metric is Error Rate (monitored via Sentry).
- If the Error Rate spikes above 2%, the Feature Flag is immediately toggled off.

**Go-to-Market (GTM)**:
- Major releases must be accompanied by an In-App announcement (using `NOTIFICATION-FLOWS.md` low-urgency channels) and an update to the public Changelog.

## 5. AI Usage Instructions
> [!TIP]  
> When an AI agent generates a large new feature, it should automatically wrap the entry point in a Feature Flag check (e.g., `if (flags.enableNewMatchmaking) { ... } else { ... }`).

## 6. Developer Usage Instructions
- Your job is not done when the code is deployed. You must monitor the telemetry for your specific feature for the first 48 hours.
- Clean up old Feature Flags. Once a feature is at 100% for 2 weeks, remove the `if/else` flag from the codebase to reduce tech debt.

## 7. Best Practices
- **Do**: Write the Changelog entry *before* you build the feature. It clarifies the user value.
- **Don't**: Tie marketing announcements to the exact minute of a code deployment. Deploy the code silently, verify it works, *then* announce it.

## 8. Maintenance Strategy
- **Owner**: Product Manager / DevOps.
- **Update Frequency**: Every major release cycle (Monthly/Quarterly).
- **Trigger**: Failures in the release process resulting in production outages.
