# Task Priorities

## 1. Purpose
Establishes the objective rubric for deciding what gets built first. It prevents the "He who shouts loudest gets the feature" anti-pattern.

## 2. Why It Matters
Time is the most constrained resource. If developers spend a sprint building a cool animation (Low Value) instead of fixing a database lock (Critical Value), the product suffers. This document defines the math of prioritization.

## 3. Example Structure
- **Priority Matrix**: Impact vs Effort.
- **Bug vs Feature**: How to balance tech debt.
- **The ICE Framework**: Impact, Confidence, Ease.

## 4. Example Content
**The ICE Framework**:
Every ticket is scored 1-10 on:
- *Impact*: How much does this move the needle on our `KPI.md`?
- *Confidence*: How sure are we that this will work?
- *Ease*: How easy is it to build? (10 = very easy).
*Total Score = I x C x E*. High scores get built first.

**Priority Tiers**:
- *P0 (Blocker)*: Production is broken. Drop everything. No feature work happens until this is fixed.
- *P1 (Critical)*: Core functionality is degraded (e.g., Matchmaking is slow).
- *P2 (High)*: Planned sprint features.
- *P3 (Low)*: Nice-to-haves, UI polish.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> If an AI agent discovers a bug while working on a P2 feature, it must classify the bug. If the bug is a P0 (e.g., a SQL injection vulnerability), the AI must immediately halt work on the P2 feature and prompt the user to address the P0 blocker.

## 6. Developer Usage Instructions
- Never work on a P3 ticket if there are P1 tickets in the sprint backlog.
- If you find a bug in production, log it immediately with a Priority Tier. Do not fix it silently without a ticket.

## 7. Best Practices
- **Do**: Re-evaluate the backlog ICE scores quarterly. Priorities shift.
- **Don't**: Label everything as P1. If everything is critical, nothing is.

## 8. Maintenance Strategy
- **Owner**: Product Manager.
- **Update Frequency**: Every Sprint Planning session.
- **Trigger**: Shifts in corporate strategy (`STRATEGY-OVERVIEW.md`).
