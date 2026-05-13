# Decision Log (ADR)

## 1. Purpose
Acts as the architectural memory of the project. It records every significant technical, architectural, or business decision made, capturing the context, the options considered, and the reasoning behind the final choice.

## 2. Why It Matters
Prevents "Chesterton's Fence" scenarios where future engineers (or AI agents) remove or alter critical architecture because they don't understand why it was built that way. It eliminates circular arguments about past tech stack choices and preserves institutional knowledge.

## 3. Example Structure
Format follows standard ADR (Architecture Decision Record):
- **ID**: Sequential Number
- **Date**: YYYY-MM-DD
- **Context**: The problem we faced.
- **Considered Options**: Alternative 1, Alternative 2, Alternative 3.
- **Decision**: What we chose.
- **Rationale**: Why we chose it (performance, cost, team familiarity).
- **Consequences**: Positive and negative side-effects of the decision.

## 4. Example Content
**ADR-004: Supabase Realtime vs Custom Socket.io Node Server**
- **Date**: 2026-04-15
- **Context**: We need sub-100ms real-time syncing for PvP trivia battles.
- **Considered**: 1. Supabase Realtime, 2. Dedicated Socket.io server on Render, 3. Firebase RTDB.
- **Decision**: Supabase Realtime.
- **Rationale**: We are already using Supabase for Auth and PostgreSQL. Utilizing their native realtime channels prevents us from managing a separate stateful WebSocket cluster, reducing DevOps overhead significantly.
- **Consequences**: 
  - *Positive*: Unified backend, simple RLS security rules apply to sockets.
  - *Negative*: We are bound by Supabase connection limits and their specific channel payload size constraints.

## 5. AI Usage Instructions
> [!WARNING]  
> If an AI agent identifies an architectural pattern that seems sub-optimal, it MUST search this `DECISION-LOG.md` before attempting to refactor it.
> - If the pattern is documented here, respect the decision. 
> - If proposing a change to an established decision, the AI must explicitly reference the ADR ID and explain why the original constraints are no longer valid.

## 6. Developer Usage Instructions
- Any time you make a decision that affects multiple components, requires a new dependency, or establishes a new pattern, add an entry here.
- PRs containing major architectural shifts will not be approved without a corresponding ADR.

## 7. Best Practices
- **Do**: Be brutally honest in the "Consequences" section about the trade-offs.
- **Do**: Keep the language objective and focused on facts, not opinions.
- **Don't**: Create ADRs for trivial things (e.g., "ADR-099: Chose blue for the submit button").

## 8. Maintenance Strategy
- **Owner**: Entire Engineering Team.
- **Update Frequency**: Ad-hoc, whenever a major decision is finalized.
- **Trigger**: Introduction of new microservices, database migrations, framework shifts, or API contract overhauls.
