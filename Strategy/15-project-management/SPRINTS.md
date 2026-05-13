# Sprints

## 1. Purpose
Defines the cadence, ceremonies, and lifecycle of a development iteration. It ensures the team moves at a predictable, sustainable pace.

## 2. Why It Matters
Without a strict sprint framework, development turns into an endless marathon of feature creep. Sprints create artificial boundaries that force prioritization, QA testing, and deployment.

## 3. Example Structure
- **Sprint Length**: 1 week, 2 weeks, etc.
- **Ceremonies**: Planning, Standups, Retrospectives.
- **Definition of Done (DoD)**: When a ticket is actually finished.

## 4. Example Content
**Sprint Lifecycle**:
- *Length*: 2 Weeks. Starts Monday, ends Friday.
- *Planning*: 1st Monday. Tickets are assigned.
- *Freeze*: 2nd Wednesday. No new code; only QA and bug fixes.
- *Release*: 2nd Friday morning.

**Definition of Done (DoD)**:
A ticket is NOT done when the code works locally. It is only "Done" when:
1. Code is reviewed and merged into `main`.
2. Vercel deploys to Production successfully.
3. The feature passes the `QA-CHECKLIST.md` in production.
4. If it introduces a new architectural pattern, `DECISION-LOG.md` is updated.

## 5. AI Usage Instructions
> [!WARNING]  
> When an AI is asked to "finish a ticket," it must remind the user of the Definition of Done. "I have generated the code. Have you tested this against the `QA-CHECKLIST.md` before we consider this task closed?"

## 6. Developer Usage Instructions
- Never drag incomplete tickets into the next sprint without explicitly addressing *why* it wasn't finished in the Retrospective.
- If a ticket requires updating the Strategy Brain, do not mark it Done until the markdown files are updated.

## 7. Best Practices
- **Do**: Keep standups under 15 minutes. Focus on blockers.
- **Don't**: Introduce new scope mid-sprint. Add it to the backlog.

## 8. Maintenance Strategy
- **Owner**: Scrum Master / Project Manager.
- **Update Frequency**: Bi-annually.
- **Trigger**: Team size doubling, requiring a shift in agile methodologies.
