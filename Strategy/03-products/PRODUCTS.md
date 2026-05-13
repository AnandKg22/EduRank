# Products Overview

## 1. Purpose
Defines the core software offerings that the company builds and maintains. It acts as the high-level catalog of what "EduRank" actually is from a software perspective.

## 2. Why It Matters
In an enterprise environment, "The App" is rarely just one thing. It's often a suite of interconnected products. Developers and AI must understand the boundaries of these products to avoid muddying codebases (e.g., putting Admin dashboard logic inside the mobile game client).

## 3. Example Structure
- **Product Name**: Official name.
- **Core Function**: What it does.
- **Target Audience**: Who uses it.
- **Platform**: Web, iOS, Android, Desktop.

## 4. Example Content
**Product 1: EduDuel Arena (Web/Mobile)**
- *Core Function*: The real-time PvP trivia combat engine.
- *Target Audience*: Students.
- *Platform*: React SPA (Mobile-optimized web).

**Product 2: EduRank Faculty Portal (Web)**
- *Core Function*: The administrative dashboard for managing questions, viewing analytics, and inviting students.
- *Target Audience*: Faculty / Deans.
- *Platform*: React SPA (Desktop-optimized).

## 5. AI Usage Instructions
> [!NOTE]  
> AI agents must isolate product logic. If asked to modify "EduDuel Arena", the AI must not touch files located in `src/pages/admin/` (Faculty Portal) unless explicitly instructed to handle a shared dependency.

## 6. Developer Usage Instructions
- Respect the architectural boundaries between products. Even if they share the same repository (Monorepo), treat them as separate logical applications.

## 7. Best Practices
- **Do**: Maintain shared libraries for common utilities (e.g., Supabase clients) that both products use.
- **Don't**: Bleed UI components across products. A faculty data-table should not share CSS with a student PvP leaderboard.

## 8. Maintenance Strategy
- **Owner**: Chief Product Officer.
- **Update Frequency**: Annually.
- **Trigger**: Launching an entirely new standalone application or sunsetting an old one.
