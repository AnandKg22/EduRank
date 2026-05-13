# API Standards

## 1. Purpose
Defines the architectural style and communication protocols for how the frontend communicates with backend services (or how third parties interact with our system).

## 2. Why It Matters
Without API standards, a codebase will inevitably end up with a mix of REST endpoints, GraphQL queries, WebSocket streams, and direct RPC calls, all handling errors differently. This causes massive friction for frontend developers trying to fetch data.

## 3. Example Structure
- **API Paradigm**: REST, GraphQL, RPC, BaaS native.
- **Versioning**: How we handle breaking API changes.
- **Idempotency**: Ensuring retries are safe.
- **Rate Limiting**: Protecting the infrastructure.

## 4. Example Content
**API Paradigm**: Supabase Client (PostgREST) + Edge Functions (REST).
- 90% of data fetching is done directly via the `@supabase/supabase-js` client (which wraps PostgREST).
- 10% is handled via `supabase.functions.invoke()` for secure operations.

**Versioning**:
- Our PostgREST API is inherently versioned by the database schema.
- For Edge Functions, use URL path versioning: `/v1/stripe-webhook`.

**Idempotency**:
- All `POST` requests to Edge Functions that result in financial or critical state changes (e.g., submitting a Match Score) must include an `Idempotency-Key` header. The server must ignore duplicate requests with the same key.

**Rate Limiting**:
- Edge Functions are rate-limited via an API Gateway/Cloudflare wrapper to 100 requests per IP per minute.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When generating data fetching code, the AI must NOT default to writing `fetch('/api/v1/users')`. It MUST use the approved paradigm: `const { data } = await supabase.from('profiles').select('*')`.

## 6. Developer Usage Instructions
- Treat Supabase queries in the frontend with the same respect as a REST API URL. Do not create massive, 5-level deep relational queries in a single component. Abstract them into custom hooks (e.g., `useProfile()`).

## 7. Best Practices
- **Do**: Document Edge Function payloads using OpenAPI/Swagger specs or strict TypeScript interfaces.
- **Don't**: Build custom Node.js Express endpoints unless explicitly mandated by the `MICROSERVICES.md` rules.

## 8. Maintenance Strategy
- **Owner**: API / Backend Lead.
- **Update Frequency**: Annually.
- **Trigger**: Opening up the API to third-party developers (Public API launch).
