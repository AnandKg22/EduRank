# Revenue Model

## 1. Purpose
Details the exact mechanisms by which the software generates money. It maps out pricing tiers, subscription lifecycles, and monetization features.

## 2. Why It Matters
A system cannot be built without understanding where the paywalls go. Engineering must design feature flags, quota limits, and billing integrations (like Stripe) deeply into the core architecture from day one.

## 3. Example Structure
- **Monetization Strategy**: Freemium, Seat-based SaaS, Usage-based, Flat-fee.
- **Pricing Tiers**: Free, Pro, Enterprise.
- **Feature Gating**: What features are restricted to which tiers?
- **Billing Integration**: Stripe, Chargebee, Manual Invoicing.

## 4. Example Content
**Monetization Strategy**: Tiered Institutional SaaS (Seat-based).
**Tiers**:
- *Basic*: 500 Students, Standard Questions, Basic Leaderboard.
- *Pro*: 2000 Students, Custom University Questions, Department Analytics.
- *Enterprise*: Unlimited, Custom Branding, SSO, API Access.
**Feature Gating**: `battle_history` retention is 30 days for Basic, unlimited for Enterprise.
**Billing**: Managed via Stripe Billing with webhooks listening for `customer.subscription.updated` to modify the `tenant_tier` in Supabase.

## 5. AI Usage Instructions
> [!TIP]  
> When writing backend logic or UI components, AI agents should automatically implement Feature Flags based on the `tenant_tier`. 
> - e.g., If rendering the "Custom Questions" button, wrap it in a tier-check and render an "Upgrade" state if the user lacks access.

## 6. Developer Usage Instructions
- Never hardcode features to specific customer IDs. Always use the tier-based feature gating system.
- Ensure all webhook endpoints processing revenue data are strictly secured and idempotently handled.

## 7. Best Practices
- **Do**: Design database schemas to easily query usage against tier limits (e.g., counting active users against a seat limit).
- **Don't**: Implement monetization logic on the frontend. A user should not be able to unlock "Pro" by changing a React state variable.

## 8. Maintenance Strategy
- **Owner**: Finance / Product Lead.
- **Update Frequency**: Whenever pricing changes.
- **Trigger**: Adjustments to billing providers, new tier launches, or promotional campaigns.
