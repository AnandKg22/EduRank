# Performance Testing

## 1. Purpose
Establishes the benchmarks and testing methodologies for ensuring the application remains fast and responsive under heavy load.

## 2. Why It Matters
A gamified education platform lives and dies by its responsiveness. If a student answers a question, but the server takes 2 seconds to register it, they lose their Speed Bonus unfairly. Performance testing guarantees latency remains within acceptable thresholds.

## 3. Example Structure
- **Key Performance Indicators (KPIs)**: Target metrics (TTFB, LCP).
- **Load Testing**: Simulating high traffic.
- **Frontend Profiling**: Ensuring 60fps animations.
- **Database Profiling**: Finding slow queries.

## 4. Example Content
**Target KPIs**:
- *Matchmaking Latency*: < 200ms from clicking "Find Match" to entering the queue.
- *In-Battle Sync*: < 50ms broadcast delay between Player A and Player B.
- *Frontend LCP (Largest Contentful Paint)*: < 1.5s on 4G mobile networks.

**Load Testing Protocol**:
- Use `k6` or `Artillery` to simulate 1,000 concurrent WebSocket connections to the Supabase Realtime cluster.
- Monitor the Supabase dashboard for CPU spikes or memory exhaustion.

**Database Profiling**:
- Use `pg_stat_statements` to identify slow queries.
- Any query taking longer than 100ms in production must be flagged for an `EXPLAIN ANALYZE` review and indexing.

**Frontend Profiling**:
- Use Chrome Lighthouse in CI/CD to prevent regressions in Core Web Vitals.
- Ensure the `<BattleArena>` component does not trigger unnecessary React re-renders every time the 20-second timer ticks down (use `useRef` for visual timers if possible).

## 5. AI Usage Instructions
> [!TIP]  
> When an AI agent generates a React component that relies on high-frequency state updates (like a countdown timer or live scoreboard), it MUST suggest performance optimizations (like `React.memo` or separating the timer into its own tiny component) to prevent the entire page from re-rendering.

## 6. Developer Usage Instructions
- Test your features using Chrome DevTools Network Throttling (set to "Fast 3G") to experience the app as a mobile user would.
- Do not fetch 1,000 rows from the database and sort them in JavaScript. Use Postgres `ORDER BY` and `LIMIT`.

## 7. Best Practices
- **Do**: Materialize heavy analytical queries into views or cache them using Edge Functions.
- **Don't**: Ignore React DevTools Profiler warnings.

## 8. Maintenance Strategy
- **Owner**: Performance Engineer / Tech Lead.
- **Update Frequency**: Every quarter.
- **Trigger**: User complaints regarding lag during peak university hours.
