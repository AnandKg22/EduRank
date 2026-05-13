# Folder Structure

## 1. Purpose
Provides a strict map of where files live within the repository. It defines the physical boundaries of the architecture, ensuring "a place for everything and everything in its place."

## 2. Why It Matters
A messy folder structure is the number one cause of "spaghetti code." If developers don't know where to put a helper function, they will put it in the same file as the UI component. A rigid structure forces modularity.

## 3. Example Structure
- **Root Directories**: What belongs at the top level.
- **Src Hierarchy**: How the application code is organized.
- **Feature/Module Pattern**: Grouping by domain vs grouping by type.

## 4. Example Content
**Paradigm**: Feature-based architecture (over Type-based).
We group files by the feature they belong to, rather than keeping all components in one folder and all hooks in another.

**src/ Directory Tree**:
- `/assets`: Static files (images, global CSS).
- `/components`: Shared, global UI components (Buttons, Modals).
  - `/ui`: Dumb, styling-only components.
  - `/layout`: App shells, Navbars.
- `/features`: The core business logic, grouped by domain.
  - `/matchmaking`: Contains its own components, hooks, and utils.
  - `/battle`: Contains its own components, hooks, and utils.
- `/hooks`: Only *global* custom hooks (e.g., `useAuth`, `useWindowSize`).
- `/pages`: Route entry points. These should be thin wrappers that import features.
- `/stores`: Global Zustand state files.
- `/utils`: Global helper functions (e.g., date formatting).

## 5. AI Usage Instructions
> [!TIP]  
> When an AI agent generates a new file, it must determine the correct directory based on this structure. 
> - If it generates a specific Matchmaking timer component, it goes in `/features/matchmaking/components/`.
> - If it generates a generic `<Button>`, it goes in `/components/ui/`.

## 6. Developer Usage Instructions
- Do not let `/pages` files grow beyond 150 lines. If a page is getting large, extract the logic into a `/features` folder.
- Avoid cross-feature imports. `features/battle` should not import components directly from `features/matchmaking`. If they share logic, that logic belongs in a global `/components` or `/utils` folder.

## 7. Best Practices
- **Do**: Keep folder depths shallow. If you are 6 folders deep, reconsider the architecture.
- **Don't**: Use generic names like `helper.js`. Name files specifically `dateFormatter.js`.

## 8. Maintenance Strategy
- **Owner**: Systems Architect.
- **Update Frequency**: Every 6 months.
- **Trigger**: The `/features` folder becoming too bloated, necessitating a Monorepo split.
