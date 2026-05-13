# Audit Logs

## 1. Purpose
Defines the strict tracking of "Who did What, When, and from Where." It ensures that every critical action in the system leaves an immutable forensic trail.

## 2. Why It Matters
If a Professor's account is compromised and deletes an entire Question Bank, without audit logs, you have no idea how it happened, when it happened, or whose IP address initiated the attack. Audit logs are the security camera of the database.

## 3. Example Structure
- **What to Log**: The actions that trigger a log entry.
- **Log Schema**: The exact payload saved.
- **Log Storage**: Where they are kept securely.
- **Retention**: How long they are stored.

## 4. Example Content
**What to Log**:
- *DO NOT log*: `SELECT` queries (too noisy).
- *DO log*: `INSERT`, `UPDATE`, `DELETE` on critical tables (`organizations`, `profiles`, `questions`).
- *DO log*: Authentication events (Login success, Login failure, Password reset).
- *DO log*: Changes to user permissions or roles.

**Log Schema (`audit_logs` table)**:
- `id` (UUID)
- `actor_id` (UUID - Who did it)
- `action` (String - e.g., `questions.delete`)
- `entity_id` (UUID - What was affected)
- `old_state` (JSONB)
- `new_state` (JSONB)
- `ip_address` (String)
- `timestamp` (TIMESTAMPTZ)

**Log Storage**:
- Logs must be stored in a separate schema (e.g., `auth.audit_log_entries` in Supabase) or a completely separate database to prevent compromised application accounts from deleting their own tracks.

## 5. AI Usage Instructions
> [!CAUTION]  
> When generating a secure Edge Function (e.g., granting a user "Admin" status), the AI MUST include a database call that inserts a record into the `audit_logs` table detailing the action.

## 6. Developer Usage Instructions
- Use Postgres Triggers to automate audit logging at the database level rather than relying on the Node.js/React application code to remember to send a log.

## 7. Best Practices
- **Do**: Make the audit logs table append-only. Deny `UPDATE` and `DELETE` permissions to all roles.
- **Don't**: Store passwords or raw credit card numbers in the `old_state`/`new_state` JSON payloads.

## 8. Maintenance Strategy
- **Owner**: Security Architect.
- **Update Frequency**: Rarely.
- **Trigger**: Identifying blind spots during a security incident post-mortem.
