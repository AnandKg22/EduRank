# Migration Rules

## 1. Purpose
Dictates how changes to the database schema are proposed, tested, and deployed to production. It ensures zero-downtime updates and prevents accidental data loss.

## 2. Why It Matters
Manually clicking buttons in the Supabase UI is fine for a weekend hackathon. In an enterprise system, a manual UI change isn't tracked in version control. If the database crashes, you cannot rebuild it. Migrations ensure the database state is treated as code.

## 3. Example Structure
- **Local vs Remote**: The CLI workflow.
- **Idempotency**: Making scripts safe to re-run.
- **Destructive Changes**: Rules for dropping columns.
- **Data Seeding**: How to populate test data.

## 4. Example Content
**Workflow**:
1. Make changes locally using `supabase start` and the local studio.
2. Run `supabase db diff -f feature_name` to generate a migration SQL file.
3. Commit the file to Git.
4. On merge to `main`, GitHub Actions automatically applies `supabase db push`.

**Idempotency**:
Migration scripts should ideally use `IF NOT EXISTS` where applicable, though Supabase tracks migration history to prevent double-execution.

**Destructive Changes**:
NEVER drop a column in a single migration if the application is currently using it.
- *Phase 1*: Add new column, update application to write to both old and new.
- *Phase 2*: Run a script to backfill old data into new column.
- *Phase 3*: Update application to read/write ONLY from the new column.
- *Phase 4*: Drop the old column.

## 5. AI Usage Instructions
> [!WARNING]  
> When an AI generates a schema change, it MUST output the change as a raw SQL migration script, NOT as instructions to "click through the UI." If tasked with a destructive change (like renaming a column), the AI must warn the user about Phase 1-4 zero-downtime rules.

## 6. Developer Usage Instructions
- Never modify the production database schema directly via the Supabase Dashboard.
- Always test migrations on your local Docker instance before creating a PR.

## 7. Best Practices
- **Do**: Keep migration files small and focused on a single feature.
- **Don't**: Include `INSERT` statements for mock data in schema migration files. Use a separate `seed.sql` file.

## 8. Maintenance Strategy
- **Owner**: Backend Lead.
- **Update Frequency**: Reviewed continuously during PRs.
- **Trigger**: Significant changes to CI/CD pipelines.
