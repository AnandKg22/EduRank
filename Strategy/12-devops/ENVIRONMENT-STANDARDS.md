# Environment Standards

## 1. Purpose
Establishes the strict separation between different stages of the application lifecycle (Local, Staging, Production) and how secrets (Environment Variables) are managed across them.

## 2. Why It Matters
Using the Production Stripe Secret Key in a local development environment will result in actual credit cards being charged during testing. Environment standards prevent catastrophic cross-contamination of data and secrets.

## 3. Example Structure
- **Environment Types**: Dev, Staging, Prod.
- **Secret Management**: How `.env` files are handled.
- **Mock Services**: Rules for using sandbox APIs.

## 4. Example Content
**Environment Types**:
1. *Local (Dev)*: Running on `localhost:5173`. Connects to a local Docker Supabase instance or a dedicated remote Dev project.
2. *Staging*: Hosted on a Vercel Preview branch. Connects to the `edurank-staging` Supabase project. Used by QA and stakeholders.
3. *Production*: Hosted on `edurank.com`. Connects to `edurank-prod` Supabase project. Real users, real data.

**Secret Management**:
- `VITE_` prefixed variables are exposed to the browser. NEVER put secrets here.
- Server-side secrets (Stripe, OpenAI) must never be committed to Git. They are injected via the Vercel/Supabase UI.
- All developers must use a `.env.local` file. An `.env.example` file must be maintained in version control with dummy values.

**Mock Services**:
- Staging and Local environments MUST use Stripe "Test Mode" keys (`sk_test_...`).

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When an AI agent modifies configuration files or writes API integrations, it must explicitly use `process.env` or `import.meta.env` and check the environment. It must never hardcode a token.

## 6. Developer Usage Instructions
- If you add a new environment variable to the app, you MUST update `.env.example` and inform DevOps to add it to Vercel/Supabase.
- Never connect your local frontend to the Production database.

## 7. Best Practices
- **Do**: Use a secret manager (like Doppler or AWS Secrets Manager) if the team grows beyond 5 engineers.
- **Don't**: Email `.env` files to new hires. Use secure credential sharing tools.

## 8. Maintenance Strategy
- **Owner**: DevOps / Tech Lead.
- **Update Frequency**: Every sprint.
- **Trigger**: Integration of new third-party services requiring API keys.
