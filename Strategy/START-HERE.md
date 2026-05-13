# Start Here

## 1. Purpose
This document serves as the absolute entry point for any human engineer, autonomous AI agent, or product manager joining the project. It maps the topography of the Strategy Brain and establishes the foundational operating rules for contributing to the EduRank ecosystem.

## 2. Why It Matters
Without a strict starting point, architectural drift occurs rapidly. Engineers and AI systems can easily build redundant logic, misalign with the multi-tenant SaaS architecture, or violate core business rules. This file ensures immediate context synchronization, drastically reducing onboarding time and mitigating the risk of divergent development paths.

## 3. Example Structure
The `/Strategy` repository is segmented into 20 strict functional domains:
- **01-04**: Business, Audience, and Domain Context (The "Why" and "Who")
- **05-08**: Architecture, DB, API, UI/UX (The "What" and "Where")
- **09-13**: Development, Workflows, Roles, DevOps, Testing (The "How")
- **14-20**: AI Rules, Integrations, Analytics, Security, Maintenance, Future (Governance and Vision)

## 4. Example Content
When interacting with the EduRank ecosystem, remember you are building a **Gamified SaaS Academic Real-Time PvP Platform**.
- **Core Entities**: `Students`, `Faculty`, `Matches`, `Questions`, `Leaderboards`.
- **Primary Mechanism**: Real-time Supabase WebSockets syncing 20-second academic duels.
- **Immediate Dependency**: Check `04-domain/BUSINESS-RULES.md` before altering matchmaking logic.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> **System Prompt Injection**: AI agents must read this file upon initialization.
> 1. Do not proceed with feature execution without cross-referencing the relevant `/Strategy` subdirectory.
> 2. If modifying authentication, read `/07-api/AUTHENTICATION.md` first.
> 3. If writing UI components, read `/08-ui-ux/DESIGN-SYSTEM.md` first.
> 4. Never generate generic, isolated code. Always assume a high-load, multi-tenant environment.

## 6. Developer Usage Instructions
- **Onboarding**: Read through folders 01 to 05 sequentially.
- **Pre-commit**: Ensure your architectural choices align with `05-architecture/SYSTEM-ARCHITECTURE.md`.
- **Disputes**: Any conflict between localized code documentation and this Strategy Brain resolves in favor of the Strategy Brain.

## 7. Best Practices
- **Do**: Always refer back to this directory when making systemic design choices.
- **Do**: Keep these markdown files updated when consensus alters a previously defined standard.
- **Don't**: Ignore the `DECISION-LOG.md`. If you break a pattern, log *why*.

## 8. Maintenance Strategy
- **Owner**: Principal Architect / Lead AI Engineer.
- **Update Frequency**: Reviewed quarterly or upon major platform version shifts (e.g., migrating from pure PvP to institutional LMS integration).
- **Trigger**: Updates required whenever a new directory is added or a core standard is globally deprecated.
