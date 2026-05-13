# Backup Strategy

## 1. Purpose
Defines the disaster recovery protocols. It answers the question: "If the data center burns down or a developer accidentally drops the `profiles` table, how quickly can we recover?"

## 2. Why It Matters
Data is the only part of a software company that cannot be rebuilt from source code. In an academic system, losing a semester's worth of ELO scores and assessment data is a company-ending event.

## 3. Example Structure
- **RPO and RTO**: Recovery Point Objective & Recovery Time Objective.
- **Backup Types**: Full vs Incremental.
- **Retention Policy**: How long we keep backups.
- **Testing Recovery**: How we prove the backups actually work.

## 4. Example Content
**RPO & RTO Objectives**:
- *RPO (Recovery Point Objective)*: Max 24 hours of data loss acceptable for free tiers. Point-In-Time-Recovery (PITR) down to the minute for Enterprise tiers.
- *RTO (Recovery Time Objective)*: System must be restored within 4 hours of a declared disaster.

**Backup Architecture**:
- Supabase performs automatic nightly physical backups.
- We utilize Supabase Point-in-Time Recovery (PITR) on the Pro plan, allowing us to revert the database to any specific second in the last 7 days.

**Retention Policy**:
- Nightly backups are retained for 30 days.
- Monthly snapshots are exported to AWS S3 Glacier and retained for 1 year for compliance reasons.

**Testing Recovery**:
- Once a quarter, DevOps must spin up a blank Supabase project and successfully restore the previous night's backup to verify data integrity.

## 5. AI Usage Instructions
> [!WARNING]  
> If an AI agent generates a script to delete data (e.g., a cron job to clean up old logs), it must include a warning comment about verifying the Backup Strategy before executing the script in production.

## 6. Developer Usage Instructions
- If you accidentally execute a destructive query in production, do not panic and do not try to fix it manually. Immediately escalate to DevOps to initiate a PITR restore.

## 7. Best Practices
- **Do**: Keep off-site backups. Relying solely on your cloud provider's internal backup tool is dangerous if your account gets locked.
- **Don't**: Include sensitive PII in developer-sandbox database dumps. Always sanitize data before moving it from Prod to Staging/Dev.

## 8. Maintenance Strategy
- **Owner**: Database Administrator.
- **Update Frequency**: Annually.
- **Trigger**: Changes in regulatory compliance or upgrading database hosting plans.
