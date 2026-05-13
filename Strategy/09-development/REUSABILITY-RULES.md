# Reusability Rules

## 1. Purpose
Defines the threshold and methodology for abstracting code into reusable functions, hooks, or components. It balances the DRY (Don't Repeat Yourself) principle against the dangers of premature abstraction.

## 2. Why It Matters
Engineers often abstract code too early, creating highly complex, generic functions that are difficult to read and impossible to modify without breaking 5 other features. Conversely, never abstracting leads to massive duplication. This file sets the "Rule of Three."

## 3. Example Structure
- **The Threshold**: When to extract code.
- **Abstraction Methodology**: How to extract it safely.
- **Anti-Patterns**: What not to do.

## 4. Example Content
**The Threshold (The Rule of Three)**:
- *One instance*: Write the code inline.
- *Two instances*: Copy-paste the code. It is cheaper to maintain two identical blocks than to build a bad abstraction.
- *Three instances*: Refactor. Extract the code into a shared utility, hook, or component.

**Abstraction Methodology**:
- *Hooks*: If three different components need to listen to Supabase Realtime presence, extract it into a `usePresence(channelName)` hook.
- *UI Components*: If three different forms use the same styled input field, extract it to `<FormInput />` in `/components/ui/`.

**Anti-Patterns (WET - Write Everything Twice vs DRY)**:
- Do not abstract purely for the sake of making a file shorter.
- Do not create "God Functions" that take 15 boolean arguments (e.g., `renderCard(isUser, isFaculty, isMobile, showShadow, hideTitle)`). If an abstraction requires massive conditional branching, it is the wrong abstraction. Create separate, specific components instead.

## 5. AI Usage Instructions
> [!WARNING]  
> AI agents are prone to premature abstraction. When asked to write a new feature, the AI must NOT spontaneously create a highly generic abstraction wrapper unless it can prove the logic is already duplicated in 3 or more places.

## 6. Developer Usage Instructions
- Before building a new utility function, search the `/utils` folder. It probably already exists.
- If you are modifying a shared utility and it breaks existing tests, consider whether the utility should be split back into two separate functions.

## 7. Best Practices
- **Do**: Keep reusable utilities pure (no side effects) whenever possible.
- **Don't**: Couple generic UI components to specific business logic (e.g., `<Button>` should not know about the `user_id`).

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Continuous.
- **Trigger**: Refactoring sprints and code reviews.
