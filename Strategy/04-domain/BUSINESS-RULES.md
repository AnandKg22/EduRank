# Business Rules

## 1. Purpose
Documents the strict, non-negotiable logic that governs how the application must behave to satisfy business or legal requirements. These are facts about the business that software cannot break.

## 2. Why It Matters
Business rules are the "Why" behind complex `if/else` statements. If a developer refactors code and accidentally removes a business rule (e.g., allowing a student to play 10 matches a day instead of the limit of 5), they create a critical exploit that damages the product's integrity.

## 3. Example Structure
- **Rule ID**: Unique identifier (e.g., BR-001).
- **Rule Statement**: Plain English description.
- **Enforcement Layer**: Where is this checked? (UI, API, DB).
- **Reasoning**: Why does this rule exist?

## 4. Example Content
**BR-001: Question Time Limit**
- *Statement*: A student has exactly 20 seconds to answer a question.
- *Enforcement*: Frontend (UI countdown) AND Backend (Timestamp validation on submission).
- *Reasoning*: Prevents students from Googling answers during a Match.

**BR-002: Speed Bonus Calculation**
- *Statement*: Answers submitted within the first 10 seconds receive a 1.5x score multiplier.
- *Enforcement*: Backend (Match Scoring Engine).
- *Reasoning*: Encourages rapid recall and creates point differentials even if both players answer correctly.

**BR-003: Matchmaking Tier Restriction**
- *Statement*: A user cannot match with someone whose ELO is more than 300 points above or below theirs.
- *Enforcement*: Backend (Matchmaking Queue query).
- *Reasoning*: Prevents "smurfing" and ensures matches remain competitive.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When an AI agent generates business logic, it must search this document for relevant BR-IDs. 
> - If generating a scoring function, it must explicitly implement `BR-002`.
> - Include the BR-ID in the code comments (e.g., `// Implements BR-002: Speed Bonus`).

## 6. Developer Usage Instructions
- Never rely solely on the frontend to enforce a Business Rule. Always enforce it at the API or Database level.
- Reference BR-IDs in your commit messages when implementing core logic.

## 7. Best Practices
- **Do**: Keep rules atomic (one rule per statement).
- **Don't**: Document standard UI validation (e.g., "Password must be 8 chars") here. Put that in UI-STANDARDS.md.

## 8. Maintenance Strategy
- **Owner**: Product Manager.
- **Update Frequency**: Every sprint.
- **Trigger**: Alterations to game mechanics or monetization logic.
