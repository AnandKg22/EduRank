# Microservices Strategy

## 1. Purpose
Defines the rules for when, why, and how to split the application into separate, independently deployable services (or Edge Functions) rather than keeping it monolithic.

## 2. Why It Matters
Premature microservices lead to "distributed monoliths"—a system with all the complexity of microservices but none of the benefits. This document prevents unnecessary fragmentation and establishes strict communication protocols for the services that *do* exist.

## 3. Example Structure
- **Philosophy**: Monolith-first vs. Microservices-first.
- **Service Boundaries**: How we decide what gets to be its own service.
- **Communication**: Sync (REST/gRPC) vs. Async (Event/Message Queues).
- **Current Services**: List of active edge functions/services.

## 4. Example Content
**Philosophy**: "Monolith-First via Supabase." We treat our Postgres Database + RLS as a monolith. We *only* extract logic into Supabase Edge Functions when security or third-party integrations demand it.

**Service Boundaries**:
Logic is extracted to an Edge Function ONLY IF:
1. It requires a secret API key that cannot be exposed to the client (e.g., Stripe, OpenAI).
2. It requires complex, transactional data processing that would be too slow/insecure on the client (e.g., post-match ELO calculation).

**Communication**:
- Edge Functions are triggered asynchronously via Postgres Database Webhooks (e.g., when a row is inserted into the `battles` table with status `finished`).
- We avoid synchronous Function-to-Function calls to prevent cascading latency failures.

**Current Services (Edge Functions)**:
- `calculate_elo`: Triggered on match finish.
- `stripe_webhook`: Listens for billing updates.
- `ai_question_gen`: Interfaces with OpenAI to generate trivia.

## 5. AI Usage Instructions
> [!TIP]  
> If prompted to build a new feature, the AI should default to placing the logic in the Frontend + Database RLS. It should only propose a new Edge Function if the task explicitly meets the "Service Boundaries" criteria defined above.

## 6. Developer Usage Instructions
- Do not create a new Edge Function just for a simple database query. Use `supabase-js` from the client.
- Ensure all Edge Functions are stateless and idempotent (safe to retry if they fail).

## 7. Best Practices
- **Do**: Monitor the execution time and memory limits of your Edge Functions.
- **Don't**: Share database connections across functions. Use Supabase connection pooling.

## 8. Maintenance Strategy
- **Owner**: Backend Lead / Cloud Architect.
- **Update Frequency**: As the system scales.
- **Trigger**: When the "Monolith-First" approach hits scaling bottlenecks and true separate microservices are required.
