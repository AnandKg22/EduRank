# Payment Gateways (Stripe)

## 1. Purpose
Maps the flow of money through the system. It dictates how subscriptions are created, how webhooks are handled securely, and how billing state is synced with the database.

## 2. Why It Matters
Mishandling payment webhooks can result in users getting free Enterprise access, or worse, paying users losing access to their data. Billing logic must be the most resilient code in the application.

## 3. Example Structure
- **Gateway**: Stripe (Platform of choice).
- **Checkout Flow**: Hosted vs Custom UI.
- **Webhook Handling**: The critical synchronization layer.
- **Database Schema**: How we track billing status.

## 4. Example Content
**Checkout Flow**:
- We use **Stripe Checkout** (Hosted Sessions) to minimize PCI-compliance scope. We do not build custom credit card forms.

**Webhook Handling**:
- *Endpoint*: `POST /functions/v1/stripe-webhook`.
- *Security*: The function MUST verify the `Stripe-Signature` header using the Webhook Secret to ensure the payload actually came from Stripe.
- *Idempotency*: The `stripe_event_id` must be logged in a `processed_webhooks` table to prevent double-processing if Stripe retries the delivery.

**Core Webhook Events to Handle**:
- `checkout.session.completed`: Provision the tier.
- `customer.subscription.updated`: Handle upgrades/downgrades.
- `customer.subscription.deleted`: Revoke access immediately.

**Database Schema (`organizations` table)**:
- `stripe_customer_id` (string)
- `subscription_tier` (enum: 'basic', 'pro', 'enterprise')
- `subscription_status` (enum: 'active', 'past_due', 'canceled')

## 5. AI Usage Instructions
> [!CAUTION]  
> If an AI agent generates the Stripe Webhook Edge Function, it MUST include the `stripe.webhooks.constructEvent()` signature verification block. Code without this security check is an immediate vulnerability.

## 6. Developer Usage Instructions
- Use the Stripe CLI (`stripe listen --forward-to localhost...`) to test webhooks locally.
- Never manually update the `subscription_tier` in the database. Always let the Stripe Webhook drive the database state. Stripe is the source of truth for money.

## 7. Best Practices
- **Do**: Handle the `past_due` status gracefully by restricting new battles but allowing read-only access to past data.
- **Don't**: Assume Webhooks arrive in chronological order.

## 8. Maintenance Strategy
- **Owner**: Backend Lead / Finance.
- **Update Frequency**: When adding new pricing tiers.
- **Trigger**: Stripe API version upgrades.
