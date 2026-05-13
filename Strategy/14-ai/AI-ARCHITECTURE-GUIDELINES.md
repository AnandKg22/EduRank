# AI Architecture Guidelines

## 1. Purpose
Teaches the AI how to think about the system from a macro-level. It prevents the AI from generating localized solutions that break global system constraints.

## 2. Why It Matters
An AI might generate a brilliant algorithm for calculating ELO, but if it places that algorithm in the React frontend, it has compromised the entire security model of the game. Architecture guidelines ensure the AI knows *where* code belongs.

## 3. Example Structure
- **System Topography**: Where logic lives.
- **State Management Map**: Where data lives.
- **Security Boundaries**: What cannot be trusted.

## 4. Example Content
**System Topography**:
- *Client (React)*: UI rendering, optimistic state updates, real-time WebSocket listening. NO SECURE LOGIC.
- *Database (Postgres)*: RLS Policies, Data persistence.
- *Edge (Deno)*: Secure third-party integrations, competitive calculations (ELO).

**State Management Map**:
- *Server State*: Data fetched from Supabase. Do not duplicate this in Zustand. Use standard React state or Supabase realtime subscriptions.
- *Client State*: UI toggles (e.g., `isModalOpen`). Store this in Zustand if it crosses component boundaries.

**Security Boundaries (The "Zero Trust" Rule)**:
- The AI must treat the React Client as compromised.
- NEVER generate code that relies on the client to calculate its own score.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When tasked with a new feature, the AI MUST explicitly state where the logic will live based on the "System Topography" before it begins generating code. 

## 6. Developer Usage Instructions
- Use this file to evaluate AI-generated architectural proposals (e.g., when you ask the AI "How should we implement Stripe?"). If the proposal violates this file, reject it.

## 7. Best Practices
- **Do**: Explain *why* a boundary exists, so the AI understands the context (e.g., "Because clients can intercept WebSocket packets...").
- **Don't**: Contradict the `05-architecture/SYSTEM-ARCHITECTURE.md` file. This file should be a digested version specifically formatted for LLM consumption.

## 8. Maintenance Strategy
- **Owner**: Chief Architect.
- **Update Frequency**: Annually.
- **Trigger**: Major shifts in the BaaS topology.
