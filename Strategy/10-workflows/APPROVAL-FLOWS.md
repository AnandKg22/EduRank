# Approval Flows

## 1. Purpose
Defines the strict sequences required when an action needs human oversight before it takes effect. In an enterprise system, very few destructive or public-facing actions happen instantly.

## 2. Why It Matters
If a developer builds a "Publish Question" button that instantly makes a question live to 50,000 students, and that question contains a typo, the system loses credibility. Approval flows ensure that the "Maker-Checker" principle is upheld in code.

## 3. Example Structure
- **Flow Name**: The action requiring approval.
- **The Maker**: The role initiating the action.
- **The Checker**: The role approving the action.
- **Database States**: How the state transitions (e.g., `draft` -> `pending` -> `approved`).

## 4. Example Content
**Flow: Publishing Custom Question Banks**
- *The Maker*: A Faculty Member (or AI Assistant).
- *The Checker*: The Department Head.
- *Database States*:
  1. Maker creates questions in `questions` table with `status = 'draft'`.
  2. Maker clicks submit. `status` becomes `pending_review`.
  3. Checker receives a notification.
  4. Checker approves. `status` becomes `live`.

**Flow: Deleting an Organization**
- *The Maker*: University Admin.
- *The Checker*: SuperAdmin (EduRank Internal Team).
- *Database States*: Requires a 30-day "soft delete" holding period before a SuperAdmin manually executes the hard delete.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> If an AI agent generates a form to create a sensitive entity (like a test or a question), it must check this document. If an approval flow is required, the AI must set the default insert state to `draft` or `pending`, NOT `live` or `published`.

## 6. Developer Usage Instructions
- Never expose an "Approve" button to the Maker of the content. RLS policies must strictly enforce that the `approver_id` != `creator_id`.
- Build UI views specifically for Checkers (e.g., an "Awaiting My Approval" dashboard tab).

## 7. Best Practices
- **Do**: Send automated emails or push notifications to the Checker when an item enters the `pending` state.
- **Don't**: Rely on soft-deletes as a replacement for a true Maker-Checker approval flow.

## 8. Maintenance Strategy
- **Owner**: Product Manager.
- **Update Frequency**: Whenever new administrative features are introduced.
- **Trigger**: Launching user-generated content (UGC) features.
