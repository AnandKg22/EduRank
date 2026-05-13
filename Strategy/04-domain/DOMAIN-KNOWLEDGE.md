# Domain Knowledge

## 1. Purpose
Provides a primer on the specific industry the software operates within. It bridges the gap between software engineering and the real-world domain (e.g., Higher Education, Esports, Gamified Assessment).

## 2. Why It Matters
Engineers often lack formal training in the domain they are building for. If an engineer doesn't understand how "Standardized ELO Systems" work or how Universities structure "Academic Semesters," they will model the database incorrectly, leading to massive technical debt when the system hits the real world.

## 3. Example Structure
- **Domain Overview**: A summary of the industry.
- **Core Mechanics**: The underlying real-world systems we are modeling.
- **Legal/Regulatory Constraints**: FERPA, GDPR, etc.
- **Industry Trends**: Where the domain is heading.

## 4. Example Content
**Domain**: Competitive Academic Assessment (Gamified EdTech).
**Core Mechanics**: 
- *ELO Rating System*: Derived from chess, it calculates relative skill levels. If a low-ELO student beats a high-ELO student, the low-ELO student gains significantly more points than if they beat a peer.
- *Academic Hierarchy*: University -> Department -> Semester -> Course -> Topic. Questions must be strictly tagged to this hierarchy.
**Regulatory Constraints**: 
- *FERPA (US)*: Student grades/performance cannot be made publicly visible without consent. Therefore, Leaderboards *must* support pseudo-anonymous display names (e.g., "Student402" instead of "John Doe").

## 5. AI Usage Instructions
> [!IMPORTANT]  
> If an AI agent is tasked with building a "Public Leaderboard," it MUST cross-reference the Regulatory Constraints in this file. It should automatically implement a feature to anonymize names or request explicit consent flags from the database.

## 6. Developer Usage Instructions
- Read this before designing any core data models.
- If you don't understand an industry acronym used by a stakeholder, check `DOMAIN-TERMINOLOGY.md` first, then ask.

## 7. Best Practices
- **Do**: Include links to external resources (e.g., Wikipedia articles on the ELO rating system).
- **Don't**: Fill this with technical software jargon. Keep it focused on the *industry*.

## 8. Maintenance Strategy
- **Owner**: Domain Expert / Product Manager.
- **Update Frequency**: Bi-annually.
- **Trigger**: Expanding into a new geographic region with different educational laws.
