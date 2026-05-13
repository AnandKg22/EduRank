# KPIs (Key Performance Indicators)

## 1. Purpose
Documents the internal metrics that tell the engineering and product teams if the software is actually successful. It aligns technical work with business outcomes.

## 2. Why It Matters
A developer might celebrate reducing API latency by 10ms, but if the "Matchmaking Abandonment Rate" (a KPI) remains at 40%, the business is failing. KPIs ensure engineers care about the right numbers.

## 3. Example Structure
- **North Star Metric**: The one metric that matters most.
- **Secondary Metrics**: Supporting health indicators.
- **Telemetry Tools**: How we track them.

## 4. Example Content
**North Star Metric**:
- *Matches Completed per Active Student per Week*. (Indicates high engagement and a healthy matchmaking queue).

**Secondary Metrics**:
- *Time to Match (TTM)*: The average seconds a user waits in the `searching` state. Target: < 15 seconds.
- *Match Abandonment Rate*: Percentage of users who close the app while in the queue. Target: < 5%.
- *DAU/MAU Ratio*: Daily Active Users vs Monthly Active Users. (Stickiness).

**Telemetry Tools**:
- *Product Analytics*: PostHog (Tracking user clicks, funnel drop-offs).
- *Performance/Errors*: Sentry (Tracking JS exceptions and API failures).

## 5. AI Usage Instructions
> [!TIP]  
> When an AI agent proposes an optimization, it should reference a KPI. For example, "Implementing this optimistic UI update for the matchmaking queue will lower perceived latency, which should positively impact the *Match Abandonment Rate* KPI."

## 6. Developer Usage Instructions
- Add PostHog tracking events `posthog.capture('match_started')` to critical user actions, not just page views.
- Do not track PII (Personally Identifiable Information) in PostHog.

## 7. Best Practices
- **Do**: Create a public dashboard in the office (or Slack channel) showing the North Star metric.
- **Don't**: Create 50 KPIs. If everything is a key indicator, nothing is. Stick to 3-5 max.

## 8. Maintenance Strategy
- **Owner**: Chief Product Officer.
- **Update Frequency**: Annually.
- **Trigger**: Reaching product-market fit or shifting the business model.
