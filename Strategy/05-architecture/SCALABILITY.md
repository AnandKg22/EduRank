# Scalability Strategy

## 1. Purpose
Documents how the system is designed to handle massive increases in user traffic, data volume, and concurrent connections without failing or requiring a complete rewrite.

## 2. Why It Matters
A real-time PvP system that works perfectly for 10 concurrent users will catastrophically fail at 10,000 concurrent users if WebSocket channels and database locks aren't designed for scale. Scalability must be architected *before* the traffic hits.

## 3. Example Structure
- **Known Bottlenecks**: The weakest links in the current architecture.
- **Horizontal vs. Vertical**: Our scaling methodology.
- **Caching Strategy**: How we reduce database load.
- **Real-Time Limits**: Constraints on WebSockets and Presence.

## 4. Example Content
**Known Bottlenecks**:
- *Supabase Realtime Connections*: Hard limit on concurrent active WebSocket connections per project tier.
- *Postgres Connection Pool*: Too many concurrent queries will exhaust the DB pool.

**Scaling Methodology**:
- We rely on *Horizontal Scaling* provided by Vercel for the frontend (Edge CDN).
- We rely on *Vertical Scaling* (Upgrading the Supabase instance tier) for the database up to a point, followed by Read Replicas.

**Caching Strategy**:
- Static assets (images, CSS) are cached on the Vercel Edge.
- Frequently accessed, rarely changing data (e.g., Global Leaderboard top 100) should be materialized in a Postgres View and queried via Edge Functions with Cache-Control headers, NOT queried directly by every client.

**Real-Time Limits**:
- **Rule**: Do NOT use Supabase `Presence` for the global user list if concurrent users > 500. `Presence` state syncs scale exponentially and will crash the channel.
- *Solution*: Scope `Presence` channels tightly. Users should only subscribe to a `Presence` channel for their specific `matchmaking_room` or `battle_id`, never a global `lobby`.

## 5. AI Usage Instructions
> [!WARNING]  
> When an AI agent generates real-time connection code, it MUST NOT create a global channel `supabase.channel('global')` and subscribe to `presence`. It must tightly scope the channel to an entity ID (e.g., `supabase.channel('room:42')`).

## 6. Developer Usage Instructions
- Always assume your query will be run by 10,000 people at the exact same second.
- Never use `SELECT *`. Only select the exact columns you need to reduce payload sizes over the wire.

## 7. Best Practices
- **Do**: Implement debouncing on the client side to prevent API spamming (e.g., during search input).
- **Don't**: Rely on the database to do heavy analytical sorting on the fly for user-facing routes.

## 8. Maintenance Strategy
- **Owner**: DevOps / Chief Architect.
- **Update Frequency**: Every time a new usage milestone is hit.
- **Trigger**: 80% utilization of current database CPU or WebSocket connection limits.
