# Response Formats

## 1. Purpose
Establishes a standardized envelope for all API responses, ensuring that the frontend can handle success, errors, and metadata in a completely predictable way.

## 2. Why It Matters
If a frontend developer has to write `if (res.data) ... else if (res.message) ... else if (res.error_code)` for every API call, the code becomes fragile. A unified response format allows for a single, robust global error handler.

## 3. Example Structure
- **Success Payload**: The standard JSON envelope for HTTP 2xx.
- **Error Payload**: The standard JSON envelope for HTTP 4xx/5xx.
- **Status Codes**: Which HTTP codes mean what.

## 4. Example Content
**Standard HTTP Codes**:
- `200 OK`: Successful read/update.
- `201 Created`: Successful insert.
- `400 Bad Request`: Invalid input (form validation failed).
- `401 Unauthorized`: No valid JWT.
- `403 Forbidden`: Valid JWT, but lacks Role permission.
- `500 Internal Error`: Server crash.

**(Note: Supabase PostgREST automatically handles its own envelope. The following applies to Custom Edge Functions)**

**Success Payload**:
```json
{
  "success": true,
  "data": {
    "elo_gained": 25,
    "new_rank": "Transistor"
  },
  "metadata": {
    "timestamp": "2026-05-13T12:00:00Z"
  }
}
```

**Error Payload**:
```json
{
  "success": false,
  "error": {
    "code": "ERR_MATCH_FORFEIT",
    "message": "Opponent disconnected before ELO calculation.",
    "details": "User ID 123 dropped socket connection."
  }
}
```

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When writing a Supabase Edge Function (`serve(async (req) => {...})`), the AI MUST format the `Response.json()` output to exactly match the Success or Error payload envelopes defined above. It must never return a bare string or an un-enveloped object.

## 6. Developer Usage Instructions
- Write a single Axios/Fetch interceptor on the frontend that checks `res.data.success`. If false, trigger a global toast notification using `error.message`.
- Never put user-facing translated text in the `error.message` from the backend. Return an `error.code` and let the frontend translate it.

## 7. Best Practices
- **Do**: Always return a `500` status code if catching an unhandled exception in an Edge Function.
- **Don't**: Return `200 OK` with an error object inside it (The "GraphQL Anti-Pattern"). Use proper HTTP status codes.

## 8. Maintenance Strategy
- **Owner**: Backend Lead / Frontend Lead.
- **Update Frequency**: Only if fundamental API architecture changes.
- **Trigger**: Adoption of GraphQL (which has its own standard envelope).
