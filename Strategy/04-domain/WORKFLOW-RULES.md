# Workflow Rules

## 1. Purpose
Defines the sequential state-machine logic for complex processes within the application. It outlines what states an entity can exist in, and what events trigger transitions between those states.

## 2. Why It Matters
Complex processes (like Matchmaking or Leave Approvals) break when developers don't agree on the exact sequence of states. If the UI thinks a match is `starting` but the database thinks it's `searching`, the app crashes. Workflow rules create an unshakeable state-machine contract.

## 3. Example Structure
- **Workflow Name**: The process being mapped.
- **Valid States**: A list of all possible statuses.
- **Transitions**: `Current State` -> `Event` -> `New State`.
- **Side Effects**: What happens during the transition.

## 4. Example Content
**Workflow: Matchmaking & Battle Lifecycle**
*Valid States*: `idle`, `searching`, `matched`, `battling`, `finished`, `forfeited`.

*Transitions*:
1. `idle` -> (User clicks Find Match) -> `searching`
   - *Side Effect*: Insert user into `matchmaking_queue` table.
2. `searching` -> (Engine finds opponent) -> `matched`
   - *Side Effect*: Create `battle_id`, lock queue, notify clients via Supabase Realtime.
3. `matched` -> (Both clients acknowledge) -> `battling`
   - *Side Effect*: Generate 15 questions, start 20s timer.
4. `battling` -> (15 questions answered) -> `finished`
   - *Side Effect*: Calculate ELO changes, update `profiles`.
5. `battling` -> (Opponent disconnects > 10s) -> `forfeited`
   - *Side Effect*: Award win to remaining player, penalize ELO of disconnected player.

## 5. AI Usage Instructions
> [!NOTE]  
> When an AI writes state-management code (e.g., Redux, Zustand, or XState), it MUST strictly adhere to these Valid States. It cannot invent intermediate states like `almost_matched` unless it updates this document first.

## 6. Developer Usage Instructions
- Enforce these states using TypeScript `Enums` or string literal unions. Do not use random string typing for statuses.
- When handling errors during a transition, ensure there is a clear fallback state (usually `idle` or an `error` boundary).

## 7. Best Practices
- **Do**: Draw a visual flowchart to accompany complex state machines.
- **Don't**: Allow direct mutations of state bypassing the allowed transitions.

## 8. Maintenance Strategy
- **Owner**: Tech Lead / Systems Architect.
- **Update Frequency**: As new features are designed.
- **Trigger**: Adding a new step to an existing process (e.g., adding a "Rematch" state).
