# AI Coding Rules

## 1. Purpose
Translates the human-readable `09-development/CODING-STANDARDS.md` into explicit, machine-enforceable rules for AI code generation.

## 2. Why It Matters
AI agents often have "hallucinated" preferences based on their training data (e.g., defaulting to `var` instead of `const`, or using Axios instead of native Fetch). This document forcefully overwrites those training biases.

## 3. Example Structure
- **Syntax Overrides**: Specific language rules.
- **Library Enforcement**: Forcing specific dependencies.
- **File Output Rules**: How the AI should structure its file creation.

## 4. Example Content
**Syntax Overrides**:
- NEVER use class-based React components. ALWAYS use functional components with Hooks.
- NEVER use default exports. ALWAYS use named exports (`export const MyComponent = ...`).

**Library Enforcement**:
- If fetching data, you MUST use `@supabase/supabase-js`. Do NOT generate `fetch()` wrappers.
- If styling, you MUST use Tailwind CSS. Do NOT generate standard `.css` files or inline `style={{}}` tags.

**File Output Rules**:
- When generating a new file, output the full file path at the top as a comment.
- Do not output partial code blocks (e.g., "Here is the updated function..."). Output the entire modified file or use precise Multi-Replace patterns.

## 5. AI Usage Instructions
> [!CAUTION]  
> AI agents MUST parse these rules before generating ANY code block. A failure to follow the "Library Enforcement" rules will result in the code being rejected.

## 6. Developer Usage Instructions
- Add specific anti-patterns you notice the AI making to this file. (e.g., if the AI keeps forgetting to use `lucide-react` for icons, add a rule here).

## 7. Best Practices
- **Do**: Phrase rules as negative constraints ("NEVER do X, ALWAYS do Y"). AI models respond better to strong boundaries.
- **Don't**: Make the rules too long. AI context windows have limits; keep it focused on the most critical syntax errors.

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Weekly during early AI adoption, then Monthly.
- **Trigger**: Code reviews flagging AI-generated anti-patterns.
