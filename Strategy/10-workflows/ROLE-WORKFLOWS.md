# Role Workflows

## 1. Purpose
Traces how different user roles interact with the system to complete a shared objective. It ensures that the handoffs between different types of users are smooth.

## 2. Why It Matters
Features are often built in silos. A developer might build a perfect "Student answers question" flow, and a perfect "Faculty grades question" flow, but fail to build the notification that tells the Faculty the question is ready for grading.

## 3. Example Structure
- **Macro Objective**: The shared goal.
- **Step-by-Step Sequence**: Chronological interaction of roles.
- **Handoff Mechanism**: How Role A passes the baton to Role B.

## 4. Example Content
**Objective: Resolving a Disputed Match Score**
1. *Student (Role)*: Views Match History. Clicks "Dispute Question". Submits a text reason.
   - *Handoff*: System sets `dispute_status = 'open'` and alerts the Department.
2. *Faculty (Role)*: Logs in. Sees the "Open Disputes" badge on their dashboard. Reviews the question and the student's answer.
   - *Handoff*: Faculty clicks "Uphold" or "Overturn".
3. *System (Automation)*: Recalculates ELO if overturned.
4. *Student (Role)*: Receives an in-app notification of the decision.

## 5. AI Usage Instructions
> [!NOTE]  
> If an AI agent generates a UI component for a specific role (e.g., a "Dispute" button for a student), it must consider the Handoff Mechanism. It should automatically suggest creating the corresponding Dashboard view for the receiving role.

## 6. Developer Usage Instructions
- When writing E2E tests (e.g., Cypress), write tests that cross role boundaries. Log in as a Student, perform an action, log out, log in as Faculty, and verify the action is visible.

## 7. Best Practices
- **Do**: Ensure every workflow has a clear definitive "End" state.
- **Don't**: Create workflows that lead to dead-ends (e.g., a student disputes a score, but the faculty has no UI to actually resolve the dispute).

## 8. Maintenance Strategy
- **Owner**: Product Manager / QA Lead.
- **Update Frequency**: Bi-annually.
- **Trigger**: Creation of cross-functional features.
