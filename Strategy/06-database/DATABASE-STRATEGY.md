# Database Strategy

## 1. Purpose
Defines the overarching philosophy for data storage, retrieval, and structural integrity. It dictates how we leverage our database engine (PostgreSQL via Supabase) to guarantee performance and security.

## 2. Why It Matters
A poorly designed database strategy leads to "N+1" query problems, massive API latency, and data corruption. Because we use a Backend-as-a-Service (BaaS) architecture where the frontend directly queries the DB, the database itself *is* our primary API. Therefore, database strategy is our API strategy.

## 3. Example Structure
- **Database Engine**: The core technology (e.g., Postgres 15).
- **Multi-Tenancy Approach**: How we isolate different B2B customers.
- **Normalization vs. Denormalization**: When to duplicate data for read speed.
- **Indexing Strategy**: Rules for applying indexes.

## 4. Example Content
**Engine**: Supabase (PostgreSQL 15).
**Multi-Tenancy**: We use Row-Level Security (RLS) for logical isolation. Every table that contains tenant data MUST have a `tenant_id` column.
**Normalization Philosophy**: Normalize by default (3NF). Only denormalize when read performance on a highly-trafficked route (like the live leaderboard) demands it.
**Indexing**: 
- *Always* index foreign keys.
- *Always* index columns used frequently in `WHERE` clauses (e.g., `status`, `tenant_id`).
- *Never* blindly add indexes, as they slow down `INSERT`/`UPDATE` operations (which are critical during a real-time battle).

## 5. AI Usage Instructions
> [!CAUTION]  
> If generating SQL to create a table, an AI agent MUST include a `tenant_id` column if the table belongs to the B2B SaaS ecosystem. It must also generate an RLS policy that restricts access using `WHERE tenant_id = current_setting('app.current_tenant_id')`.

## 6. Developer Usage Instructions
- Never create a table via the Supabase UI "Table Editor" without also exporting the SQL to a migration file. 
- Avoid heavy triggers that execute synchronous HTTP requests.

## 7. Best Practices
- **Do**: Use Postgres native types (e.g., `UUID`, `JSONB`, `TIMESTAMPTZ`).
- **Don't**: Use `TEXT` for primary keys. Always use `UUIDv4`.

## 8. Maintenance Strategy
- **Owner**: Database Administrator / Backend Lead.
- **Update Frequency**: When encountering significant read/write bottlenecks.
- **Trigger**: Moving from logical RLS multi-tenancy to physical multi-tenancy (separate DB instances per enterprise client).
