# Product Roadmap

## 1. Purpose
Outlines the chronological sequence of major feature releases over the next 3 to 12 months. It communicates the direction of the product to the entire team.

## 2. Why It Matters
Knowing what is coming down the pipeline allows engineers to make smart architectural compromises today. If you know a massive "Multiplayer 4v4" mode is coming in Q4, you won't hardcode the battle system to strictly expect an array of exactly 2 players.

## 3. Example Structure
- **Current Quarter (Q2)**: Committed, active development.
- **Next Quarter (Q3)**: Planned, high confidence.
- **Future (Q4+)**: Exploratory, low confidence.

## 4. Example Content
**Q2 2026 (Current)**
- Stabilize 1v1 Real-Time Matchmaking.
- Deploy Faculty Analytics Dashboard MVP.
- Implement Anti-Cheat (Forfeit detection).

**Q3 2026 (Planned)**
- Institutional SSO (SAML/Google Workspace).
- "Boss Battles" (100 students vs 1 Faculty member).
- iOS/Android native app wrappers via Capacitor.

**Q4 2026 (Future)**
- Global Cross-University Tournaments.
- AI-generated question banks based on uploaded PDF syllabi.

## 5. AI Usage Instructions
> [!TIP]  
> If an AI agent suggests a complex architectural addition, it should check the roadmap to see if it aligns with the Current Quarter. 
> - If the user asks for "AI-generated questions" right now, the AI might remind them: "This is scheduled for Q4. Should we prioritize this over the Q2 Matchmaking stabilization?"

## 6. Developer Usage Instructions
- Do not proactively build features scheduled for Q4 just because they sound fun. Stick to the current sprint priorities.
- Use the roadmap to leave "hooks" in your code for future features (e.g., naming a variable `players[]` instead of `player1` and `player2`).

## 7. Best Practices
- **Do**: Keep it flexible. Roadmaps change.
- **Don't**: Put exact dates on future quarters. Use generalized timeframes.

## 8. Maintenance Strategy
- **Owner**: Chief Product Officer.
- **Update Frequency**: Quarterly.
- **Trigger**: End-of-quarter planning meetings.
