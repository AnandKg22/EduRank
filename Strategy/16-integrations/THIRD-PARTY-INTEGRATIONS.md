# Third-Party Integrations

## 1. Purpose
Provides a centralized registry of all external APIs and services the application depends on. It defines the rules for adding new dependencies and managing API keys.

## 2. Why It Matters
"Vendor lock-in" and "API Key Sprawl" are dangerous. If developers spread API calls to 5 different SaaS providers directly from React components, the app becomes fragile and impossible to audit. This document forces a unified integration strategy.

## 3. Example Structure
- **Approved Vendors**: The whitelist of third-party tools.
- **Integration Patterns**: How we connect (Webhooks vs Polling, SDK vs REST).
- **Fallback Strategies**: What happens when they go down.

## 4. Example Content
**Approved Vendors**:
- *Auth*: Supabase GoTrue, Google OAuth.
- *Billing*: Stripe.
- *Transactional Email*: Resend.
- *AI/ML*: OpenAI API.
- *Analytics*: PostHog.

**Integration Patterns**:
- ALL third-party REST API calls that require a secret key MUST be executed from a Supabase Edge Function, never from the client.
- Prefer Webhooks (Push) over Polling (Pull) to receive data from third parties (e.g., waiting for a Stripe payment to succeed).

**Fallback Strategies**:
- If the AI Question Generation API (OpenAI) goes down, the system must gracefully fall back to the static, pre-written question bank stored in the Postgres database without crashing the Matchmaking queue.

## 5. AI Usage Instructions
> [!CAUTION]  
> If tasked to "Send a text message," the AI must NOT invent a new integration (like Twilio) if an approved vendor already exists for that category, OR if it violates the `NOTIFICATION-FLOWS.md`. Always check the Approved Vendors list first.

## 6. Developer Usage Instructions
- Never commit an API key to the repository.
- Wrap third-party SDKs in a custom service file (e.g., `src/services/stripe.js`) so that if we switch vendors, we only have to update one file, not 50 React components.

## 7. Best Practices
- **Do**: Set strict timeouts on all external API requests (e.g., 5000ms). Do not let a slow third-party API hang our Edge Functions indefinitely.
- **Don't**: Rely on third-party uptime for core user flows unless absolutely necessary.

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Every time a new vendor contract is signed.
- **Trigger**: Replacing a service (e.g., moving from SendGrid to Resend).
