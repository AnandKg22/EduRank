# UX Principles

## 1. Purpose
Outlines the psychological and behavioral guidelines that govern how the application should *feel* to use. It bridges the gap between static screens and human interaction.

## 2. Why It Matters
Good UI is about how it looks; Good UX is about how it works. A technically flawless system can still fail if it makes the user feel stupid, lost, or bored. UX Principles ensure the product remains intuitive and engaging.

## 3. Example Structure
- **Core Philosophies**: The guiding mantras of the user experience.
- **Friction vs Flow**: When to make things easy vs hard.
- **Gamification Mechanics**: How to maintain engagement.
- **Feedback Loops**: How the system responds to user actions.

## 4. Example Content
**Core Philosophies**:
- *Clarity over Cleverness*: Do not use obscure icons without text labels just because they "look clean."
- *Forgiveness*: It should be easy to undo a mistake (e.g., "Undo" toast after deleting a question).

**Friction vs Flow**:
- *Frictionless*: Joining a matchmaking queue should be exactly 1 click.
- *Intentional Friction*: Deleting an entire faculty account should require typing the account name to confirm.

**Gamification (EduRank Specific)**:
- Users must constantly feel progression. Even a loss in a duel should highlight a "Micro-achievement" (e.g., "Fastest answer in round 3!").

**Feedback Loops**:
- Every action must have an immediate visual reaction. If a button is clicked, it must depress, show a spinner, or trigger a toast within 100ms.

## 5. AI Usage Instructions
> [!NOTE]  
> When an AI agent suggests a new feature workflow, it must evaluate it against "Clarity over Cleverness." If the workflow requires the user to memorize keyboard shortcuts to succeed, the AI must propose a more discoverable UI alternative.

## 6. Developer Usage Instructions
- If you notice a user flow requires more than 3 clicks to reach a primary destination, raise an issue.
- Always implement optimistic UI updates for non-critical data (e.g., "Liking" a post should instantly update the heart icon, before the server confirms).

## 7. Best Practices
- **Do**: Read up on established UX laws (Fitts's Law, Hick's Law).
- **Don't**: Use "dark patterns" to trick users (e.g., hiding the unsubscribe button).

## 8. Maintenance Strategy
- **Owner**: UX Lead / Product Manager.
- **Update Frequency**: Annually.
- **Trigger**: Major shifts in audience demographics or user testing results.
