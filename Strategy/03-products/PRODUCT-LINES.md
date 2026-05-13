# Product Lines (Modules)

## 1. Purpose
Breaks down large products into logical, manageable modules or feature sets. This creates natural boundaries for micro-frontends, microservices, or team assignments.

## 2. Why It Matters
When a product scales, a single team cannot manage the whole monolith. Defining product lines (e.g., "The Matchmaking Engine" vs "The Authentication Service") allows for parallel development and clear ownership.

## 3. Example Structure
- **Module Name**: Logical grouping.
- **Core Responsibility**: What this module handles.
- **Dependencies**: What other modules it relies on.

## 4. Example Content
**Module: Matchmaking Engine**
- *Responsibility*: Queuing users, finding ELO-appropriate opponents, and initializing `battle_id`s in the database.
- *Dependencies*: Presence Module, Auth Module.

**Module: Live Battle Core**
- *Responsibility*: Managing the 20-second timer, broadcasting score updates via WebSockets, and handling disconnects.
- *Dependencies*: Matchmaking Engine, Question Bank Module.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When refactoring code, AI agents must respect module boundaries. A change in the "Matchmaking Engine" must not directly mutate the DOM of the "Live Battle Core". Use strict interface contracts (e.g., Zustand stores or Supabase channels) to communicate between modules.

## 6. Developer Usage Instructions
- Organize your folder structure (`/src/modules/` or `/src/features/`) to reflect these product lines.
- Avoid circular dependencies between modules.

## 7. Best Practices
- **Do**: Keep modules as decoupled as possible.
- **Don't**: Create "God modules" that handle everything from auth to game logic.

## 8. Maintenance Strategy
- **Owner**: Engineering Manager / Tech Lead.
- **Update Frequency**: Every sprint cycle.
- **Trigger**: When a file or component becomes too large and needs to be split into a new logical module.
