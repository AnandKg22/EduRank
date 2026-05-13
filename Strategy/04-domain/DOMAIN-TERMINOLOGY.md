# Domain Terminology (Ubiquitous Language)

## 1. Purpose
Establishes a single, canonical dictionary for the project. It ensures that the business stakeholders, the developers, and the AI agents all use the exact same words to describe the same concepts.

## 2. Why It Matters
If the business calls them "Students", the database calls them `users`, the frontend calls them `players`, and the AI generates a component for `competitors`, the codebase becomes an unreadable, unsearchable mess. A Ubiquitous Language eliminates translation errors.

## 3. Example Structure
- **Term**: The canonical word.
- **Definition**: What it means in our context.
- **Aliases (DO NOT USE)**: Common incorrect terms.
- **Code Representation**: The exact variable/table name used in the stack.

## 4. Example Content
**Term**: Match
- *Definition*: A single 15-question competitive session between two Students.
- *Aliases*: Game, Round, Quiz, Duel.
- *Code Representation*: `table: battles`, `variable: currentBattle`. *(Note: We use 'battle' in code due to legacy reasons, but 'Match' in UI. Future refactor should align this).*

**Term**: Faculty
- *Definition*: A university employee authorized to view analytics and manage question banks.
- *Aliases*: Teacher, Admin, Professor.
- *Code Representation*: `role: 'faculty'`.

## 5. AI Usage Instructions
> [!CAUTION]  
> AI agents MUST use the exact Code Representation terms defined here when generating schemas, variables, or API routes. 
> - If a user asks the AI to "Create a new Game table", the AI should correct them: "Based on `DOMAIN-TERMINOLOGY.md`, the canonical term is `Match` (stored as `battles`). I will proceed with `battles`."

## 6. Developer Usage Instructions
- Never invent a new synonym in your code.
- If a domain concept does not have a term here, agree on one with the PM and add it *before* you name your variables.

## 7. Best Practices
- **Do**: Enforce these terms in PR reviews.
- **Don't**: Keep outdated aliases around. Refactor the code to match the terminology document whenever possible.

## 8. Maintenance Strategy
- **Owner**: Tech Lead / Product Manager.
- **Update Frequency**: Continuous.
- **Trigger**: Whenever a new feature introduces new domain concepts.
