# Access Control

## 1. Purpose
Documents the technical implementation of how Roles and Permissions are enforced across the stack (Database RLS, API Gateway, and Frontend Routes).

## 2. Why It Matters
You can have perfectly defined roles and permissions on paper, but if the React Router isn't locked down, or the Postgres table lacks an RLS policy, the system is wide open. This document bridges theory and code.

## 3. Example Structure
- **Frontend Guarding**: How React prevents unauthorized viewing.
- **API Guarding**: How Edge Functions validate tokens.
- **Database Guarding**: How Postgres RLS is written.

## 4. Example Content
**Frontend Guarding (React Router)**:
- We use a `<ProtectedRoute>` wrapper around routes.
- ` <Route element={<ProtectedRoute requiredRole="faculty" />}> `
- If unauthorized, the user is redirected to `/unauthorized`, NOT back to `/login` (which causes redirect loops if they are already authenticated).

**API Guarding (Deno Edge Functions)**:
- The function must immediately parse the `Authorization` header.
- `const user = await supabase.auth.getUser(token)`
- Manually verify the user's `app_metadata.role` before executing any logic.

**Database Guarding (Postgres RLS)**:
- RLS is the absolute source of truth.
- *Example Policy*: 
```sql
CREATE POLICY "Faculty can insert questions" 
ON questions FOR INSERT 
WITH CHECK (
  (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')::text) = 'faculty'
);
```

## 5. AI Usage Instructions
> [!WARNING]  
> If tasked with creating a new admin page, the AI agent MUST wrap the new route in a `<ProtectedRoute>`. If tasked with creating the corresponding SQL table, it MUST generate the RLS policy that matches the frontend restriction.

## 6. Developer Usage Instructions
- Test your RLS policies thoroughly. Create a mock student user and attempt to `POST` to a faculty endpoint via curl/Postman to ensure the database rejects it.
- Do not store roles in a `users` table and query it on every request. Rely on the securely signed JWT `app_metadata` injected by Supabase GoTrue.

## 7. Best Practices
- **Do**: Fail securely. If the system cannot determine a user's role, default to `Student` or reject access entirely.
- **Don't**: Trust the frontend state (like Zustand/Redux) for API security. The frontend is easily manipulated.

## 8. Maintenance Strategy
- **Owner**: Security Architect.
- **Update Frequency**: Only when upgrading core infrastructure.
- **Trigger**: Migrating to a new auth provider or router paradigm.
