# Company Context

## 1. Purpose
Provides the cultural, historical, and operational backdrop of the organization. It explains how the team operates, the company's maturity stage, and resource constraints.

## 2. Why It Matters
An AI or new developer proposing a complex, multi-region Kubernetes mesh for a seed-stage startup is wasting time. Context ensures that technical solutions are appropriately sized for the company's current reality.

## 3. Example Structure
- **Company Stage**: Seed / Series A / Enterprise.
- **Team Topology**: How engineering, design, and product interact.
- **Resource Constraints**: Budget limitations, tight deadlines, etc.
- **Company Values**: Speed over perfection, or stability over speed?

## 4. Example Content
**Company Stage**: Agile Seed-stage startup.
**Team Topology**: Small, cross-functional pods. Developers often wear DevOps and QA hats.
**Resource Constraints**: Bootstrapped infrastructure. We rely heavily on Serverless (Vercel) and BaaS (Supabase) to minimize DevOps overhead.
**Values**: "Ship quickly, iterate safely." We prefer a slightly buggy feature in production over a perfect feature stuck in PR for a month, *except* for core matchmaking logic.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> AI agents must tailor their tool recommendations to this context. 
> - **Constraint**: Do not recommend heavy, expensive enterprise tools (like self-hosted Kafka) when lightweight Serverless options exist.
> - **Tone**: Align generated code comments and documentation with the company's specific cultural values.

## 6. Developer Usage Instructions
- Use this context to judge the appropriate level of "over-engineering" required for a task.
- Understand that wearing multiple hats is expected at this stage.

## 7. Best Practices
- **Do**: Be transparent about resource limitations.
- **Don't**: Present an idealized version of the company. Honesty here prevents burnout.

## 8. Maintenance Strategy
- **Owner**: Operations Lead / Engineering Manager.
- **Update Frequency**: Every 6 months or post-funding rounds.
- **Trigger**: Significant shifts in team size or funding.
