# Deployment

## 1. Purpose
Documents the exact process by which code moves from a developer's laptop to the production servers. It ensures that deployments are repeatable, automated, and safe.

## 2. Why It Matters
"It works on my machine" is unacceptable in enterprise software. A formalized deployment strategy prevents accidental overrides, ensures environment variables are synced, and allows for instant rollbacks if a bad build goes live.

## 3. Example Structure
- **Pipeline Overview**: The CI/CD flow.
- **Merge Strategies**: Rules for merging into `main`.
- **Rollback Procedure**: How to undo a disaster.
- **Release Management**: When do we deploy?

## 4. Example Content
**Pipeline Overview**:
- We use Vercel for Frontend and Supabase CLI for Backend.
- Code is pushed to a `feature-branch` on GitHub.
- Vercel automatically generates a Preview Deployment URL.
- Once merged into `main`, Vercel deploys to Production automatically.

**Merge Strategies**:
- No direct commits to `main`.
- Squash and Merge is enforced. Commit history on `main` should be a clean list of completed features, not 50 "fix typo" commits.

**Rollback Procedure**:
- *Frontend*: 1-click rollback via the Vercel dashboard to the previous stable deployment.
- *Database*: Revert the last Supabase migration via the CLI (`supabase db reset` locally, or applying a down migration to prod—handled manually by DevOps).

## 5. AI Usage Instructions
> [!CAUTION]  
> If an AI agent generates instructions for the user to "deploy" their code, it must NEVER suggest FTP, manual zip uploads, or direct SSH into a production server. It must suggest the `git push` workflow tied to the CI/CD pipeline.

## 6. Developer Usage Instructions
- Do not merge a PR until the Vercel Preview Build successfully compiles and the GitHub Actions tests pass.
- Ensure all required Environment Variables are added to the Vercel Production dashboard *before* merging a feature that relies on them.

## 7. Best Practices
- **Do**: Tag releases in Git (e.g., `v1.2.0`).
- **Don't**: Deploy at 5:00 PM on a Friday.

## 8. Maintenance Strategy
- **Owner**: DevOps Lead.
- **Update Frequency**: Every 6 months.
- **Trigger**: Moving to a new hosting provider (e.g., Vercel to AWS Amplify).
