# Technical Debt

## 1. Purpose
Provides a structured ledger for documenting sub-optimal code, temporary hacks, and architectural shortcuts that were taken to meet a deadline.

## 2. Why It Matters
Technical debt is not inherently bad; it is a tool used to ship faster. But just like financial debt, if it is not documented and paid down, the interest payments (slow development, constant bugs) will eventually bankrupt the project.

## 3. Example Structure
- **Debt Registry**: A list of known shortcuts.
- **Interest Rate**: How much this debt is hurting us right now (High/Medium/Low).
- **Repayment Plan**: The proposed architectural fix.

## 4. Example Content
**Debt-001: Client-Side ELO Calculation Fallback**
- *Description*: During a server outage, we implemented a fallback where the React client calculates ELO if the Edge Function times out.
- *Interest Rate*: HIGH. This is a massive security risk allowing users to spoof scores.
- *Repayment Plan*: Remove the client-side fallback. Implement a queue system (SQS or Postgres Queue) so if the Edge Function fails, the calculation is retried asynchronously later.

**Debt-002: Hardcoded University IDs in Seed Script**
- *Description*: The `seed-questions.mjs` script hardcodes 3 specific `tenant_id`s.
- *Interest Rate*: LOW. It only affects local development setup, not production.
- *Repayment Plan*: Refactor the script to dynamically query the first 3 organizations from the DB.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> If an AI agent is asked to write a "quick and dirty" fix or bypasses an architectural standard to make something work, it MUST prompt the user: "This violates our standards. Shall I add an entry to `TECHNICAL-DEBT.md` to track this shortcut?"

## 6. Developer Usage Instructions
- When you encounter terrible code, do not just complain in Slack. Log it here with a proposed "Repayment Plan."
- Dedicate 10% to 20% of every sprint to paying down items on this list.

## 7. Best Practices
- **Do**: Be specific. Link to exact file names and line numbers.
- **Don't**: Use this file to attack other developers. Focus on the code, not the author.

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Every Sprint Retrospective.
- **Trigger**: Shipping a feature that feels "hacky."
