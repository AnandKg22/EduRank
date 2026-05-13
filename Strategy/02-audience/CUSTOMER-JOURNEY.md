# Customer Journey

## 1. Purpose
Maps the end-to-end lifecycle of a user, from first discovering the platform to becoming an active daily user, and eventually an advocate.

## 2. Why It Matters
A feature might work perfectly in isolation, but fail miserably within the user's broader journey. For example, a complex PvP tutorial is useless if it's placed before the user has even created an account—it introduces friction too early.

## 3. Example Structure
The journey is typically broken into phases:
- **Phase 1: Discovery** (How they find us).
- **Phase 2: Onboarding** (Their first 5 minutes).
- **Phase 3: Activation** (The "Aha!" moment).
- **Phase 4: Retention** (Why they come back).

## 4. Example Content
**Phase 1: Discovery**
- *Student*: Receives an invite link from a friend via WhatsApp: "I just beat you on the leaderboard!"
**Phase 2: Onboarding**
- *Student*: Clicks link, authenticates via Google OAuth (1-click), selects their Engineering Department.
**Phase 3: Activation**
- *Student*: Plays their first bot-match. Sees the real-time score bar move. Experiences the "Speed Bonus" rush.
**Phase 4: Retention**
- *Student*: Receives a push notification: "You have dropped to Rank 4. Fight to reclaim your spot."

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When AI agents are tasked with creating a new feature (e.g., "Add a tutorial"), they must evaluate *where* in the Customer Journey it belongs. 
> - If it's an Activation feature, it must be frictionless.
> - If it's a Retention feature, it can afford to be more complex.

## 6. Developer Usage Instructions
- Never introduce a feature that breaks the "Activation" phase (e.g., adding a 5-page form before the first battle).

## 7. Best Practices
- **Do**: Optimize the journey for the shortest possible time-to-value (TTV).
- **Don't**: Assume the journey is linear. Users will drop off and re-enter at different stages.

## 8. Maintenance Strategy
- **Owner**: Product Manager / Growth Hacker.
- **Update Frequency**: Quarterly.
- **Trigger**: Changes to onboarding flows or the introduction of new acquisition channels.
