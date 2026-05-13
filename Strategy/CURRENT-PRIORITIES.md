# Current Priorities

## 1. Purpose
Maintains a living, real-time context of the active development sprint, immediate architectural fires, and highest-priority business goals. It tells AI and developers exactly what matters *right now*.

## 2. Why It Matters
AI context windows are easily diluted. If an AI agent does not know the current priority is "Stabilize Real-Time Matchmaking," it might waste tokens and time refactoring CSS. This document laser-focuses session energy on what is blocking the current release.

## 3. Example Structure
- **Phase**: Pre-Launch Alpha Stabilization.
- **P0 (Critical)**: Matchmaking race conditions, Supabase connection drops, Mobile/Desktop sync state.
- **P1 (High)**: ELO calculation edge cases, Faculty Dashboard UI.
- **P2 (Medium)**: CSV Bulk imports, cosmetic animations.
- **P3 (Backlog)**: Third-party auth providers, analytics dashboards.

## 4. Example Content
**Current Sprint Focus (May 2026)**: Resolving the infinite searching state in `FindMatchButton.jsx`.
**Context**: We are currently experiencing a desynchronization between desktop host creation and mobile client joining. The `matched` signal from Supabase Realtime is occasionally missed.
**Immediate Goal**: Implement a robust handshake protocol with absolute atomic battle room creation.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> AI agents must read this file before suggesting large refactors. 
> 1. Identify the P0/P1 priorities.
> 2. Do not offer unsolicited optimizations for P3 areas unless they directly block a P0 objective.
> 3. If asked "What should we work on next?", read this file and propose addressing the top P0 issue.

## 6. Developer Usage Instructions
- Check this document daily.
- Update this document when a P0 issue is resolved and pushed to production.
- Use this to push back against scope creep during active sprints.

## 7. Best Practices
- **Do**: Keep descriptions concise and actionable.
- **Do**: Include links to relevant Jira/Linear tickets or specific file paths (e.g., `src/pages/BattlePage.jsx`).
- **Don't**: Let this file become a graveyard of old priorities. Remove completed items immediately.

## 8. Maintenance Strategy
- **Owner**: Scrum Master / Technical Lead.
- **Update Frequency**: Weekly (at the start of every sprint) or whenever a critical hotfix interrupts standard flow.
- **Trigger**: Sprint planning meetings, emergency production outages.
