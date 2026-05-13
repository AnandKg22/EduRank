# User Personas

## 1. Purpose
Creates specific, relatable, fictional characters representing segments of the audience. This breathes life into abstract demographics, giving the team "real" people to design for.

## 2. Why It Matters
Saying "We need to optimize the query for users with a lot of data" is vague. Saying "We need to optimize this query so *Professor Davis* doesn't time out when pulling end-of-semester reports" creates empathy and actionable constraints.

## 3. Example Structure
- **Persona Name & Role**: (e.g., Alex the Competitor).
- **Goals**: What are they trying to achieve?
- **Motivations**: Why do they care?
- **Behaviors**: How do they use the software?

## 4. Example Content
**Persona 1: "Alex the Competitor" (Student)**
- *Goals*: Reach "Transistor" rank before midterms. Win department bragging rights.
- *Motivations*: Social status among peers, test preparation disguised as gaming.
- *Behaviors*: Logs in daily for 15-minute bursts. Rage-quits if matchmaking takes > 30 seconds.

**Persona 2: "Professor Davis" (Faculty)**
- *Goals*: Identify which students are struggling with Thermodynamics before the final exam.
- *Motivations*: Improving department pass rates.
- *Behaviors*: Logs in weekly on a Monday morning. Looks exclusively at the Analytics Dashboard.

## 5. AI Usage Instructions
> [!TIP]  
> Use Personas in prompts to generate more accurate user stories. 
> Example: "Write a Cypress E2E test for the login flow from the perspective of Professor Davis."

## 6. Developer Usage Instructions
- When writing a feature ticket, explicitly state which Persona the feature is for.
- "As Alex, I want to see a history of my duels so I can review questions I got wrong."

## 7. Best Practices
- **Do**: Give them realistic names, faces (if using design docs), and specific quirks.
- **Don't**: Create too many personas. 3 to 5 is the sweet spot.

## 8. Maintenance Strategy
- **Owner**: UX Researcher.
- **Update Frequency**: Bi-annually.
- **Trigger**: New feature sets that target previously unaddressed users.
