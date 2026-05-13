# AI Context Engineering

## 1. Purpose
Provides standard operating procedures for human developers on how to interact with the AI, how to construct prompts, and how to effectively feed this Strategy Brain into the AI's context window.

## 2. Why It Matters
If a developer just says "Fix the matchmaking bug," the AI will thrash around blindly. Context engineering teaches the human how to "load the AI's brain" with the right subset of these 82 strategy files.

## 3. Example Structure
- **Prompt Blueprints**: Templates for asking the AI for help.
- **Context Injection**: Which files to attach for which tasks.
- **Debugging Protocols**: How to use the AI to find bugs.

## 4. Example Content
**Prompt Blueprint: Creating a Component**
*Template*: "Act as EduRank Architect. Read `@DESIGN-SYSTEM.md` and `@UI-STANDARDS.md`. Generate a React component for [Feature] that satisfies the user persona defined in `@USER-PERSONAS.md`."

**Context Injection Matrix**:
- *Task: Database Migration*: Attach `DATABASE-STRATEGY.md`, `MIGRATION-RULES.md`, and `TABLE-STANDARDS.md`.
- *Task: UI Component*: Attach `DESIGN-SYSTEM.md`, `COMPONENT-STANDARDS.md`, and `BRAND.md`.
- *Task: Fixing a Bug*: Attach `CURRENT-PRIORITIES.md`, `DECISION-LOG.md`, and the specific file where the bug lives.

**Debugging Protocols**:
- Do not paste the error and say "Fix this."
- Instead, paste the error, attach `SYSTEM-ARCHITECTURE.md`, and ask: "Based on our architecture, where is the most likely failure point that would produce this error?"

## 5. AI Usage Instructions
> [!NOTE]  
> If a user provides a very short, vague prompt (e.g., "make a button"), the AI should request more context: "Please specify the context. Should I reference the `DESIGN-SYSTEM.md` for styling, and what `WORKFLOW-RULES.md` does this button trigger?"

## 6. Developer Usage Instructions
- Treat the AI like a junior developer who has read the manual but lacks intuition. Provide the manual (Strategy Files) explicitly with every major request.

## 7. Best Practices
- **Do**: Use IDE features (like Cursor's `@` mentions) to quickly attach the specific Markdown files from the `/Strategy` folder.
- **Don't**: Attach all 82 files to every prompt. You will exhaust the context window and dilute the AI's focus.

## 8. Maintenance Strategy
- **Owner**: Lead AI Engineer.
- **Update Frequency**: Continuous.
- **Trigger**: Discovering new, highly effective prompting techniques.
