# Security Testing

## 1. Purpose
Defines the protocols for actively attacking the application to find vulnerabilities before malicious actors do. It shifts security from a passive architecture (defined in `SECURITY-ARCHITECTURE.md`) to an active testing phase.

## 2. Why It Matters
You can write the best Row Level Security (RLS) policies in the world, but if you never actually test them by attempting to hack your own app, a typo in the SQL could leave the database wide open.

## 3. Example Structure
- **Vulnerability Scanning**: Automated SAST/DAST tools.
- **RLS Verification**: How to test database security.
- **Penetration Testing**: Manual hacking protocols.
- **Dependency Audits**: Managing vulnerable NPM packages.

## 4. Example Content
**Vulnerability Scanning**:
- We use GitHub Advanced Security / Dependabot to scan for compromised `npm` packages on every PR.
- PRs containing critical CVEs will automatically fail the CI build.

**RLS Verification (Database Security)**:
- Create automated `pgTAP` tests that authenticate as `Student A` and attempt to `UPDATE` the profile of `Student B`. The test MUST assert that the database returns an error or 0 rows affected.

**Penetration Testing Focus Areas**:
- *WebSocket Hijacking*: Attempting to join a `supabase.channel()` for a battle you are not a part of.
- *Rate Limit Evasion*: Attempting to brute-force the password reset endpoint.
- *XSS (Cross-Site Scripting)*: Attempting to upload malicious JavaScript in the "Dispute Reason" text box.

## 5. AI Usage Instructions
> [!CAUTION]  
> If an AI agent is asked to review a Pull Request, it must explicitly look for Security anti-patterns (e.g., using `dangerouslySetInnerHTML` in React, or passing raw user input into a SQL query bypassing Supabase parameterized queries).

## 6. Developer Usage Instructions
- Never disable Dependabot alerts. If an alert is a false positive, document why in the GitHub UI.
- Run `npm audit` locally before pushing a major dependency upgrade.

## 7. Best Practices
- **Do**: Think like an attacker. Ask "How could a student use this feature to artificially inflate their ELO?"
- **Don't**: Expose stack traces to the frontend in production.

## 8. Maintenance Strategy
- **Owner**: Security Architect.
- **Update Frequency**: Bi-annually.
- **Trigger**: Post-incident reviews or annual compliance audits.
