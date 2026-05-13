# Component Standards

## 1. Purpose
Defines the anatomy of a perfect UI component. It establishes rules for state management, prop passing, performance optimization, and file structure within a component.

## 2. Why It Matters
React components can easily become 1,000-line monsters mixing UI, API calls, and business logic. Component Standards enforce the "Single Responsibility Principle" at the UI level, keeping components testable and reusable.

## 3. Example Structure
- **Component Types**: Smart (Container) vs Dumb (Presentational).
- **Anatomy of a Component**: Order of imports, hooks, and returns.
- **Prop Management**: Destructuring, default values, Prop Drilling limits.
- **Performance**: When to use `memo` or `useCallback`.

## 4. Example Content
**Component Types**:
- *Presentational (Dumb)*: Only receives props, returns JSX. Has no `useEffect` or API calls. Example: `<LeaderboardRow />`.
- *Container (Smart)*: Fetches data, manages state, and passes data down to Presentational components. Example: `<LeaderboardPage />`.

**Component Anatomy**:
1. Imports (External, then Internal, then CSS).
2. Interface/Type definitions (if using TS/JSDoc).
3. Component definition.
4. Hooks (`useContext`, `useStore`, `useState`).
5. Derived state / Computed variables.
6. Event Handlers (`handle...`).
7. `useEffect` blocks.
8. JSX `return`.

**Prop Management**:
- Always destructure props in the function signature: `const Button = ({ variant = 'primary', onClick, children }) => {...}`.
- Max Prop Drilling depth is 2 levels. If you need to pass data deeper, use Context or Zustand.

## 5. AI Usage Instructions
> [!CAUTION]  
> When generating React components, AI agents MUST strictly follow the Component Anatomy order. They must default to creating Dumb components unless specifically asked to wire up an API call.

## 6. Developer Usage Instructions
- A component file should not exceed 250 lines of code. If it does, break it down.
- Never write API fetch logic directly inside a JSX component. Abstract it into a custom hook (e.g., `const { data } = useLeaderboard()`).

## 7. Best Practices
- **Do**: Name event handler props as `onEvent` (e.g., `onSubmit`) and internal handler functions as `handleEvent` (e.g., `handleSubmit`).
- **Don't**: Use inline arrow functions in the JSX if it causes performance issues in large lists. Extract them to `useCallback`.

## 8. Maintenance Strategy
- **Owner**: Frontend Lead.
- **Update Frequency**: As React evolves.
- **Trigger**: New React paradigms (e.g., React Server Components adoption).
