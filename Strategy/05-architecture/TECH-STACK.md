# Tech Stack

## 1. Purpose
The definitive, exhaustive list of the languages, frameworks, libraries, and tools approved for use in the project. It acts as a strict whitelist to prevent dependency bloat.

## 2. Why It Matters
Developers love trying new tools. Left unchecked, a project will end up with Axios, Fetch, React Query, SWR, Redux, and Zustand all doing the same thing. A strict Tech Stack document ensures consistency, reduces bundle size, and simplifies onboarding.

## 3. Example Structure
- **Frontend**: Frameworks, State Management, Styling.
- **Backend/BaaS**: Database, Auth, Edge Compute.
- **DevOps/Tooling**: CI/CD, Package Manager, Linters.
- **Deprecated/Banned**: Tools we explicitly do not use.

## 4. Example Content
**Frontend Stack**:
- *Framework*: React 18 + Vite.
- *Styling*: Tailwind CSS + `lucide-react` (icons).
- *State Management*: `Zustand` (Global), `React Context` (Auth only).
- *Data Fetching*: `@supabase/supabase-js`. Do NOT use Axios or custom fetch wrappers.
- *Routing*: `react-router-dom` v6.

**Backend Stack**:
- *Platform*: Supabase (PostgreSQL 15).
- *Compute*: Deno (Supabase Edge Functions).
- *Realtime*: Supabase Realtime Channels.

**Tooling**:
- *Package Manager*: `npm` (strictly `npm`, do not use `yarn` or `pnpm`).
- *CI/CD*: GitHub Actions -> Vercel deployments.

**Banned/Deprecated**:
- *Redux*: Too much boilerplate.
- *Material UI*: Conflicts with our custom Tailwind design system.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When generating code, AI agents MUST strictly use the tools listed here. 
> - If an AI needs to make an API call, it must use `@supabase/supabase-js`.
> - If an AI needs global state, it must generate a `Zustand` store.
> - Never inject `Axios` or `Redux` into this project.

## 6. Developer Usage Instructions
- If you find a problem that requires a new library, you must propose an update to this document in your Pull Request. The Tech Lead must approve the addition to the Tech Stack.

## 7. Best Practices
- **Do**: Include specific version numbers for core frameworks if breaking changes are a concern (e.g., React Router v6).
- **Don't**: Add utility libraries (like `lodash`) if modern native JavaScript (ES6+) can handle the task.

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Every 6 months.
- **Trigger**: Dependency audits, security vulnerabilities, or major framework updates.
