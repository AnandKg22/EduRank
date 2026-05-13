# User Pain Points

## 1. Purpose
Documents the friction, frustrations, and negative experiences the audience currently faces (either with our app or the status quo). It acts as a prioritized list of problems to solve.

## 2. Why It Matters
Engineering teams often fall in love with their solutions rather than the user's problems. Documenting pain points ensures that every line of code written is actively reducing friction for a real user.

## 3. Example Structure
- **Pain Point**: The specific frustration.
- **Impact Level**: High/Medium/Low (How much does this hurt retention?).
- **Current Workaround**: What the user does right now to bypass the issue.
- **Target Persona**: Who feels this pain?

## 4. Example Content
**Pain Point**: Infinite "Searching for Match" spinner.
- *Impact Level*: CRITICAL. Leads to immediate app abandonment.
- *Current Workaround*: User force-refreshes the browser.
- *Target Persona*: Alex the Competitor.

**Pain Point**: Cannot upload a class list easily.
- *Impact Level*: High. Blocks faculty onboarding.
- *Current Workaround*: Manually typing 100 student emails into the invite form.
- *Target Persona*: Professor Davis.

## 5. AI Usage Instructions
> [!WARNING]  
> When an AI is debugging a system (like matchmaking), it should cross-reference this file to understand the *user impact* of the bug, helping it prioritize performance vs correctness in its proposed fix.

## 6. Developer Usage Instructions
- When refactoring code, check if your refactor accidentally re-introduces a known pain point (e.g., making an animation slower).

## 7. Best Practices
- **Do**: Base these on actual user feedback, support tickets, or telemetry.
- **Don't**: Invent pain points just to justify a cool feature you want to build.

## 8. Maintenance Strategy
- **Owner**: Customer Success / Product Manager.
- **Update Frequency**: Monthly.
- **Trigger**: Post-release feedback cycles and support ticket analysis.
