# System Architecture

## 1. Purpose
Provides the "Big Picture" blueprint of how the entire software ecosystem fits together. It defines the major nodes (clients, servers, databases, third-party APIs) and how data flows between them.

## 2. Why It Matters
Without a unified architectural map, developers will accidentally build anti-patterns—like a React client trying to talk directly to a private microservice, bypassing the API Gateway, or using REST polling when a WebSocket connection already exists.

## 3. Example Structure
- **High-Level Diagram**: A text-based or Mermaid.js diagram of the system.
- **Core Components**: Descriptions of each major block in the diagram.
- **Data Flow**: How a typical request travels through the system.
- **Network Boundaries**: Public vs. Private subnets, VPCs.

## 4. Example Content
**Architecture Overview (EduRank)**:
We utilize a heavily decentralized Backend-as-a-Service (BaaS) architecture to minimize DevOps.

```mermaid
graph TD
    Client[React Vite SPA] -->|Supabase-js (REST & WebSockets)| Supabase[Supabase Platform]
    Client -->|HTTPS| Vercel[Vercel CDN/Edge]
    Supabase -->|PostgreSQL| DB[(Cloud SQL DB)]
    Supabase -->|Realtime| Channels[Phoenix WebSocket Cluster]
    Supabase -->|Auth| GoTrue[GoTrue Auth Service]
    DB -->|Webhooks| EdgeFunc[Supabase Edge Functions]
    EdgeFunc -->|Stripe API| Stripe[Stripe Billing]
```

**Core Components**:
- **Client**: Hosted on Vercel. Static assets delivered via Edge CDN.
- **Supabase**: Handles Auth, Database (PostgreSQL), and Realtime (WebSockets) directly from the client via Row Level Security (RLS).
- **Edge Functions**: Used *only* for secure, server-side operations that cannot be trusted to the client (e.g., calculating ELO after a match, processing Stripe webhooks).

## 5. AI Usage Instructions
> [!CAUTION]  
> AI agents MUST respect this architecture. If asked to "create an endpoint to save user scores," the AI must NOT generate an Express.js Node server. It must generate a direct Supabase `insert()` call from the React client, protected by RLS, or a Supabase Edge Function if secure calculation is needed.

## 6. Developer Usage Instructions
- Do not introduce new infrastructural pieces (like Redis, RabbitMQ, or custom Node servers) without an architecture review. Our strategy relies on Supabase handling the heavy lifting.

## 7. Best Practices
- **Do**: Push logic as close to the Database as possible (using RLS, Postgres Functions, and Triggers).
- **Don't**: Build middleware layers if Supabase can handle the authorization natively.

## 8. Maintenance Strategy
- **Owner**: Chief Architect.
- **Update Frequency**: Only during major infrastructural overhauls.
- **Trigger**: Migrating away from BaaS to self-hosted microservices.
