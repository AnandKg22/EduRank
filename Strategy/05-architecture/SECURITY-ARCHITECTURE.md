# Security Architecture

## 1. Purpose
Defines the technical safeguards, encryption standards, and architectural patterns used to protect user data, prevent unauthorized access, and mitigate system exploits.

## 2. Why It Matters
In a gamified system, users *will* try to cheat (e.g., sending fake score payloads). In an academic system, data breaches violate strict privacy laws (FERPA/GDPR). Security cannot be an afterthought; it must be baked into the database layer and API design.

## 3. Example Structure
- **Threat Model**: Primary vectors of attack we are guarding against.
- **Authentication**: How we verify identity.
- **Authorization**: How we restrict access (RLS).
- **Anti-Cheat Mechanisms**: Game-specific security.

## 4. Example Content
**Threat Model**:
1. *Packet Sniffing*: Students intercepting WebSocket payloads to see opponent's questions.
2. *Payload Spoofing*: Students sending `UPDATE battles SET score = 9999` directly to the DB.
3. *Data Scraping*: Bots scraping the user profiles database.

**Authentication**:
- Exclusively handled by Supabase GoTrue (JWT tokens).
- Passwords are not stored. We rely on OAuth (Google) or Magic Links where possible.

**Authorization (Row Level Security - RLS)**:
- This is our primary defense. The frontend has direct DB access, so the DB MUST defend itself.
- Every table must have RLS enabled.
- *Policy Example*: `battles` table. A user can only `UPDATE` a row if `auth.uid() == player1_id OR auth.uid() == player2_id`.

**Anti-Cheat**:
- The client NEVER calculates the final ELO. It only submits the `answer_id` and the `timestamp`.
- A secure Edge Function calculates if the answer was correct, the speed bonus, and the resulting ELO.

## 5. AI Usage Instructions
> [!CAUTION]  
> If an AI agent generates a SQL migration to create a new table, it MUST include the `ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;` command, followed by at least one secure `CREATE POLICY` statement.
> The AI must NEVER generate code that trusts the client's calculation of sensitive data (scores, money, ELO).

## 6. Developer Usage Instructions
- Never expose sensitive API keys (e.g., Stripe Secret Key, Supabase Service Role Key) to the Vite frontend (`VITE_...` variables).
- Always validate input on the server/database, even if the UI has form validation.

## 7. Best Practices
- **Do**: Use Supabase's `auth.uid()` in Postgres functions to guarantee identity.
- **Don't**: Rely on hiding UI elements as a security measure.

## 8. Maintenance Strategy
- **Owner**: Security Lead / Head of Engineering.
- **Update Frequency**: Every 6 months or post-audit.
- **Trigger**: Penetration testing results, or introduction of new compliance requirements (e.g., SOC2).
