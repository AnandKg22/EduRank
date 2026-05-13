# QA Checklist

## 1. Purpose
Provides a standardized, manual checklist that must be completed before any major release. It catches the human-centric edge cases that automated tests miss.

## 2. Why It Matters
Automated tests check if the code does what the developer *thinks* it should do. Manual QA checks if the app actually *feels* right. A checklist prevents the "I forgot to check it on Safari" syndrome.

## 3. Example Structure
- **Pre-Flight Checks**: Environment and config verification.
- **Cross-Browser Matrix**: Which browsers must be checked.
- **Critical Paths**: Workflows that must never break.
- **Visual/UX Checks**: Non-functional requirements.

## 4. Example Content
**Pre-Flight Checks**:
- [ ] Vercel Preview URL deployed successfully.
- [ ] Staging Database migrations applied successfully.
- [ ] All necessary API keys (Stripe test keys) are present in the Staging environment.

**Cross-Browser Matrix**:
- [ ] Chrome (Mac/Windows).
- [ ] Safari (iOS Mobile). *Crucial for WebKit specific WebSocket bugs.*
- [ ] Firefox.

**Critical Paths (Must pass manually)**:
- [ ] User can sign up via Google OAuth.
- [ ] Student can enter the Matchmaking Queue.
- [ ] Two students match, and the 20s timer stays perfectly synced on both screens.
- [ ] Post-match ELO updates instantly without requiring a page refresh.

**Visual/UX Checks**:
- [ ] App is usable in both Light and Dark mode.
- [ ] No horizontal scrolling on mobile devices (320px width).
- [ ] Loading spinners appear during API calls.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> While AI cannot perform manual QA on a physical iPhone, it can parse this checklist to generate Cypress E2E scripts that automate the "Critical Paths" section.

## 6. Developer Usage Instructions
- Do not mark a Jira/Linear ticket as "Done" until you have personally run through the relevant sections of this checklist on your own branch.
- Treat Safari on iOS as a first-class citizen during testing; it handles WebSockets differently than Chrome.

## 7. Best Practices
- **Do**: Keep the checklist focused on high-value, high-risk areas.
- **Don't**: Make the checklist so long (100+ items) that developers blindly check boxes without actually testing.

## 8. Maintenance Strategy
- **Owner**: QA Lead / Product Manager.
- **Update Frequency**: Every sprint.
- **Trigger**: New critical features being added to the product.
