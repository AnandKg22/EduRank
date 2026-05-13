# Security Policies

## 1. Purpose
Provides the human-centric rules for maintaining a secure engineering environment. It covers employee access, device management, and incident response.

## 2. Why It Matters
Technical security (`SECURITY-ARCHITECTURE.md`) is useless if an engineer leaves their laptop unlocked at a coffee shop or commits the production database password to a public GitHub repo. Security Policies patch the "human vulnerability."

## 3. Example Structure
- **Access Control Policy**: Who gets access to what.
- **Incident Response Plan**: What to do when breached.
- **Secret Management**: How developers handle keys.

## 4. Example Content
**Access Control Policy**:
- Principle of Least Privilege: Developers only get access to the Staging database.
- Production database access is restricted to the Lead DevOps engineer and is only granted via a secure, logged bastion host or zero-trust VPN.
- Offboarding: All access must be revoked within 1 hour of an employee's termination.

**Incident Response Plan**:
1. *Identify*: Confirm the breach is real.
2. *Contain*: Disconnect the affected service (e.g., cycle all database passwords immediately).
3. *Eradicate*: Patch the vulnerability.
4. *Recover*: Restore from a clean `BACKUP-STRATEGY.md` snapshot.
5. *Communicate*: Notify affected users within 48 hours (Legal requirement).

**Secret Management**:
- Never share `.env` files over Slack. Use a secure password manager (e.g., 1Password, Doppler).

## 5. AI Usage Instructions
> [!CAUTION]  
> If an AI agent generates a script for a developer to run locally, it MUST NOT instruct the developer to pull the production database down to their local machine. It should instruct them to pull the staging database.

## 6. Developer Usage Instructions
- If you accidentally commit a secret to GitHub, do not just delete the file in the next commit. The secret is already compromised in the git history. You must immediately cycle (invalidate) the API key at the provider level.

## 7. Best Practices
- **Do**: Require 2FA (Two-Factor Authentication) on all developer accounts (GitHub, Vercel, Supabase).
- **Don't**: Blame the developer who caused the breach. Blame the system that allowed them to cause it.

## 8. Maintenance Strategy
- **Owner**: Chief Information Security Officer (CISO).
- **Update Frequency**: Annually.
- **Trigger**: Growing the team beyond the initial founding engineers.
