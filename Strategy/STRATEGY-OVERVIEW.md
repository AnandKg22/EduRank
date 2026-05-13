# Strategy Overview

## 1. Purpose
Provides a macro-level summary of the EduRank/EduDuel product philosophy. It bridges the gap between high-level company mission and technical execution, serving as the connective tissue that aligns business objectives with software architecture.

## 2. Why It Matters
Engineers and AI agents often optimize for localized technical efficiency at the expense of the broader product vision. By clearly defining the operational strategy—such as prioritizing real-time gamified engagement over traditional static testing—all technical decisions naturally bias towards latency reduction, real-time concurrency, and high-stakes user experience.

## 3. Example Structure
- **Strategic Pillar 1**: Low-Latency Academic Combat.
- **Strategic Pillar 2**: Multi-Tenant Institutional Scaling (B2B2C).
- **Strategic Pillar 3**: AI-Assisted Assessment and Fallbacks (Bot matching).
- **Strategic Pillar 4**: Data-Driven Pedagogical Insights.

## 4. Example Content
**The EduRank Differentiator:** 
We are not building a static quiz app. We are building a *synchronous academic combat arena*. 
- **Tech Reflection**: This means polling the database is unacceptable. We rely entirely on `Supabase Realtime` channels and optimistic UI updates to achieve sub-100ms perceived latency during matches.
- **Business Reflection**: Engagement loops mimic competitive gaming (ELO tiers, ranking seasons, speed bonuses) rather than traditional schooling (grades, certificates).

## 5. AI Usage Instructions
> [!CAUTION]  
> When proposing architecture, the AI must evaluate its solution against the Strategic Pillars.
> - **Query**: "Does this approach introduce latency that breaks the synchronous duel experience?"
> - If Yes: Discard the approach. Propose an event-driven or edge-computed alternative.
> - Always assume the system requires real-time horizontal scalability.

## 6. Developer Usage Instructions
- Use this document to understand *why* certain technical constraints exist (e.g., why we enforce strict atomic locks on battle creation).
- When writing RFCs (Requests for Comments) or architectural proposals, explicitly state which Strategic Pillar your feature supports.

## 7. Best Practices
- **Do**: Bias towards real-time interactivity.
- **Do**: Treat educational content with the same strict state management as financial transactions.
- **Don't**: Introduce batch-processing paradigms into real-time paths (e.g., scoring must be instantaneous, not chron-jobbed).

## 8. Maintenance Strategy
- **Owner**: Head of Product / Chief Architect.
- **Update Frequency**: Bi-annually or during major product pivot discussions.
- **Trigger**: Modify when the company decides to alter its core value proposition (e.g., moving from individual PvP to massive multiplayer classroom battles).
