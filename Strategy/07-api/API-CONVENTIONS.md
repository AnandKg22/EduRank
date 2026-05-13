# API Conventions

## 1. Purpose
Focuses strictly on the naming, formatting, and structural conventions of API requests and responses. It ensures predictability across all network payloads.

## 2. Why It Matters
If one endpoint returns `{"user_id": 1}` and another returns `{"userId": 1}`, the frontend must constantly write translation layers. Strict conventions eliminate this wasted effort.

## 3. Example Structure
- **Payload Casing**: JSON formatting rules.
- **HTTP Methods**: Strict mapping of CRUD to HTTP verbs.
- **Query Parameters**: Standardized filtering and pagination.
- **Edge Function Naming**: Naming conventions for serverless functions.

## 4. Example Content
**Payload Casing**: 
- ALL JSON payloads (both Request and Response) MUST use `snake_case` to natively map to the PostgreSQL database columns. Do NOT use `camelCase` in network payloads.

**HTTP Methods (For Edge Functions)**:
- `GET`: Read data (rarely used since we use PostgREST).
- `POST`: Create a new record or trigger an action (e.g., `POST /v1/calculate-elo`).
- `PATCH`: Partially update a record. (Do not use `PUT`).
- `DELETE`: Remove a record.

**Pagination**:
- Standardize on Offset/Limit for basic tables: `?limit=20&offset=40`.
- Standardize on Cursor-based pagination for high-velocity real-time feeds (like Battle History): `?cursor=last_seen_uuid`.

**Edge Function Naming**:
- Use kebab-case for URL endpoints: `supabase.functions.invoke('process-payment')`.

## 5. AI Usage Instructions
> [!NOTE]  
> When generating TypeScript interfaces for API payloads or Supabase database rows, the AI must ensure properties are `snake_case` (e.g., `interface Profile { first_name: string; }`).

## 6. Developer Usage Instructions
- If you prefer `camelCase` in your React components, use a transformer/interceptor to convert the `snake_case` API response at the network boundary. Do not mix casings in the database or network layers.

## 7. Best Practices
- **Do**: Always return a consistent wrapper object for custom Edge Functions (see `RESPONSE-FORMATS.md`).
- **Don't**: Use `POST` for fetching data just because the query payload is large.

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Rarely.
- **Trigger**: Shifting from REST/PostgREST to a GraphQL paradigm.
