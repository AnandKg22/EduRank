# Data Protection

## 1. Purpose
Defines the strict rules for how Personally Identifiable Information (PII) is collected, stored, anonymized, and eventually destroyed.

## 2. Why It Matters
In the EdTech space, data protection is paramount. Mishandling student data violates FERPA (US) and GDPR (EU), resulting in massive fines and institutional bans.

## 3. Example Structure
- **Data Classification**: Public, Internal, Confidential, Restricted.
- **Encryption Standards**: Data at rest and in transit.
- **Data Retention**: How long we keep it.
- **Right to be Forgotten**: How we delete a user completely.

## 4. Example Content
**Data Classification**:
- *Public*: Aggregate leaderboard statistics.
- *Internal*: Application logs (excluding IP addresses).
- *Confidential*: Student ELO scores, Match history.
- *Restricted (PII)*: Real names, Email addresses, Passwords.

**Encryption Standards**:
- *In Transit*: TLS 1.3 enforced on all API endpoints.
- *At Rest*: Supabase natively encrypts the PostgreSQL database at the volume level.

**Right to be Forgotten (GDPR/CCPA)**:
- When a user requests account deletion, we do not soft-delete their `profile`.
- We hard-delete the `profile` row.
- `battles` records are kept for historical ELO integrity, but the foreign key (`player1_id`) is set to `NULL` via `ON DELETE SET NULL`, stripping the match of PII.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> If an AI agent generates an analytical query or CSV export feature, it MUST automatically exclude `Restricted` columns (like email addresses) unless explicitly authorized by a specific Role constraint.

## 6. Developer Usage Instructions
- Never log user email addresses or passwords in `console.log()` or telemetry tools like Sentry.
- When creating a mock database seed script, use a library like `faker.js` to generate dummy names. Do not use real user data.

## 7. Best Practices
- **Do**: Implement a "Download My Data" button to comply with data portability laws.
- **Don't**: Store data you don't actually need just because "it might be useful later."

## 8. Maintenance Strategy
- **Owner**: Data Protection Officer (DPO) / Legal.
- **Update Frequency**: Annually.
- **Trigger**: Expanding operations to a country with new data protection laws.
