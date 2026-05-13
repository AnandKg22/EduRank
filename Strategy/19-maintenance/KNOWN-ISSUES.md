# Known Issues

## 1. Purpose
Serves as the public (internal to the company) record of bugs, glitches, and UX weirdness that currently exist in the production environment but are not critical enough to warrant dropping everything to fix.

## 2. Why It Matters
Without a Known Issues list, the QA team and Customer Support will repeatedly report the same bug, wasting engineering time triaging duplicates. This document acknowledges "Yes, we know it's broken, and we accept it for now."

## 3. Example Structure
- **Issue Description**: What is broken.
- **Workaround**: How the user can bypass it.
- **Severity**: Why we aren't fixing it right now.
- **Ticket Link**: The Jira/Linear reference.

## 4. Example Content
**Issue: Safari WebSocket Disconnects on Backgrounding**
- *Description*: If a user on iOS Safari minimizes the browser during a match to check a text message, the Supabase Realtime channel drops immediately, causing an unfair "Forfeit."
- *Workaround*: Tell users not to leave the app during a 20-second match.
- *Severity*: Moderate. It affects mobile users, but it enforces the "no cheating" rule inadvertently.
- *Ticket*: `EDU-1042`

**Issue: Admin Dashboard Pagination Glitch**
- *Description*: Clicking "Page 5" on the Question Bank sometimes renders Page 4's data until the user refreshes.
- *Workaround*: Refresh the page.
- *Severity*: Low. Only affects Faculty, and the workaround takes 1 second.
- *Ticket*: `EDU-998`

## 5. AI Usage Instructions
> [!NOTE]  
> When an AI agent is tasked with debugging a system, it should check this file first. If the bug is a "Known Issue," the AI should ask the user if they want to prioritize fixing it now or continue with their original prompt.

## 6. Developer Usage Instructions
- If Customer Support flags a bug that you don't have time to fix this sprint, document it here immediately so Support can give users a workaround.

## 7. Best Practices
- **Do**: Include exact steps to reproduce the issue.
- **Don't**: Let critical, data-destroying bugs live here. Those belong in `CURRENT-PRIORITIES.md` as P0 blockers.

## 8. Maintenance Strategy
- **Owner**: QA Lead / Support Team.
- **Update Frequency**: Weekly.
- **Trigger**: Bug triage meetings.
