# Coding Standards

## 1. Purpose
Defines the strict syntactical and architectural rules for writing code in this repository. It ensures that the codebase reads as if it were written by a single, highly disciplined engineer.

## 2. Why It Matters
Inconsistent code causes cognitive friction. If one file uses `.then()` and another uses `async/await`, or one uses `default exports` and another uses `named exports`, developers spend brainpower translating styles instead of solving problems.

## 3. Example Structure
- **Language Rules**: JavaScript/TypeScript specifics.
- **Naming Conventions**: Variables, functions, constants.
- **Error Handling**: How to `try/catch`.
- **Formatting**: Prettier/ESLint rules.

## 4. Example Content
**Language Rules**:
- Prefer explicit `return` statements for complex React components; use implicit returns only for simple one-liners.
- Always use `async/await`. Do not use Promise chaining (`.then()`).

**Naming Conventions**:
- *Variables/Functions*: `camelCase` (e.g., `calculateElo`).
- *Components/Classes*: `PascalCase` (e.g., `BattleArena`).
- *Constants (Global)*: `UPPER_SNAKE_CASE` (e.g., `MAX_MATCH_DURATION = 20`).
- *Booleans*: Must start with `is`, `has`, `should`, or `can` (e.g., `isGameOver`).

**Error Handling**:
- Do not swallow errors. A `catch (error)` block must either handle the error (show a toast) or re-throw it to a boundary.
- Always log the raw error object to a telemetry service (or console in dev) before showing a sanitized message to the user.

**Formatting**:
- Enforced strictly by Prettier. 
- Single quotes for JavaScript strings. Double quotes for JSX attributes.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> AI agents MUST strictly adhere to these conventions when generating code. 
> - If an AI generates a boolean variable named `loading`, it must be auto-corrected to `isLoading`.
> - The AI must not generate old-style `function() {}` syntax for React components; it must use `const Component = () => {}` arrow functions.

## 6. Developer Usage Instructions
- Set up your IDE to run ESLint and Prettier on save.
- Do not debate formatting in Code Reviews. If Prettier formats it, that is the law.

## 7. Best Practices
- **Do**: Use early returns (Guard Clauses) to avoid deep nesting of `if/else` blocks.
- **Don't**: Leave `console.log()` statements in production code. Use a dedicated logger utility.

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Rarely.
- **Trigger**: Upgrading to a new major version of ECMAScript or TypeScript that introduces better syntax.
