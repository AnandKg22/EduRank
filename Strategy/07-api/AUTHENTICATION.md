# Authentication & Authorization

## 1. Purpose
Documents exactly how a user proves who they are (Authentication) and how the system decides what they are allowed to do (Authorization).

## 2. Why It Matters
A single flaw in this layer can expose the entire user database. Developers must have absolute clarity on how tokens are managed, where they are stored, and how roles are validated.

## 3. Example Structure
- **Auth Provider**: The underlying identity service.
- **Token Management**: JWT storage and lifecycle.
- **SSO / Social Logins**: Supported third-party providers.
- **Authorization Flow**: How permissions are evaluated post-login.

## 4. Example Content
**Auth Provider**: Supabase GoTrue.
- We do not handle password hashing manually. All auth is delegated to Supabase.

**Token Management**:
- JWTs are stored securely in HTTP-only cookies for SSR applications, or LocalStorage/SessionStorage for the SPA frontend (managed automatically by `supabase-js`).
- Tokens expire every 1 hour and are automatically refreshed by the client library.

**SSO / Social Logins**:
- *Students*: Google OAuth is the primary login method.
- *Faculty*: Enterprise SAML SSO (via Azure AD or Google Workspace) is required for institutional accounts.

**Authorization Flow (RLS)**:
- Upon login, the JWT contains the `user.id`.
- The frontend makes a request to the DB.
- PostgreSQL evaluates the Row Level Security policy: `CREATE POLICY "Users can view own data" ON profiles FOR SELECT USING (auth.uid() = id);`

## 5. AI Usage Instructions
> [!CAUTION]  
> AI agents MUST NOT write custom JWT generation or verification logic in Edge Functions unless explicitly bridging to a legacy system. They must use `supabase.auth.getUser(jwt_from_header)` to validate identities securely.

## 6. Developer Usage Instructions
- Never store sensitive data (like `is_admin = true`) in LocalStorage and trust it on the frontend.
- Protect all React Routes using a `<ProtectedRoute>` wrapper that checks `supabase.auth.getSession()`.

## 7. Best Practices
- **Do**: Rely on the JWT `app_metadata` to store global roles (like 'faculty' vs 'student') to prevent extra DB lookups on every request.
- **Don't**: Implement your own "Reset Password" token generation. Use the BaaS native methods.

## 8. Maintenance Strategy
- **Owner**: Security Lead.
- **Update Frequency**: Whenever new login methods are added.
- **Trigger**: Institutional clients demanding custom SAML/SSO integrations.
