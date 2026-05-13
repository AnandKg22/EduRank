# Optimization Strategy

## 1. Purpose
Defines the ongoing process for making the application faster, cheaper to run, and more resource-efficient over time.

## 2. Why It Matters
A system that works perfectly on Day 1 will slowly degrade over Year 1 as the database grows, component trees deepen, and bundle sizes inflate. Optimization must be a continuous, structured effort, not a panicked reaction to a crash.

## 3. Example Structure
- **Frontend Optimization**: Bundle size and rendering limits.
- **Database Optimization**: Query analysis and vacuuming.
- **Cost Optimization**: Managing cloud bills.

## 4. Example Content
**Frontend Optimization**:
- *Bundle Limits*: The initial JavaScript payload must remain under 300kb (gzipped). Use Route-based Code Splitting (`React.lazy()`) for Admin routes so Students don't download Faculty-only charting libraries like Chart.js.
- *Image Assets*: All user avatars must be served in `WebP` format with aggressive caching.

**Database Optimization**:
- *Query Plans*: Every quarter, the top 10 most frequent queries are analyzed using `EXPLAIN ANALYZE`. Missing indexes must be added.
- *Archiving*: Matches older than 1 year are moved from the primary `battles` table to cold storage (`battles_archive`) to keep index sizes small and query times fast.

**Cost Optimization**:
- Avoid heavy Edge Function invocations for things the client can do.
- Monitor Supabase egress bandwidth. Ensure the frontend is caching repeated data requests locally.

## 5. AI Usage Instructions
> [!TIP]  
> If an AI agent generates a React component that imports a massive third-party library (like `moment.js` or `three.js`), it MUST propose using dynamic imports (`import()`) to prevent inflating the main bundle size.

## 6. Developer Usage Instructions
- Run `npm run build` locally and analyze the Vite rollup output before merging large PRs. If you added 500kb to the bundle, justify it.
- Use `useMemo` for expensive calculations, but do not use it blindly on every variable, as that carries its own overhead.

## 7. Best Practices
- **Do**: Set up automated bundle-size checking in GitHub Actions.
- **Don't**: Prematurely optimize code before measuring it. Use profilers first.

## 8. Maintenance Strategy
- **Owner**: Performance Engineer.
- **Update Frequency**: Quarterly.
- **Trigger**: Cloud provider bills increasing disproportionately to user growth.
