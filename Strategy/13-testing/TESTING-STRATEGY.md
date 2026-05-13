# Testing Strategy

## 1. Purpose
Establishes the overarching philosophy for verifying code quality. It dictates what gets tested, how it gets tested, and the balance between manual QA and automated coverage.

## 2. Why It Matters
A system without tests is a house of cards; developers become afraid to refactor, leading to stagnation. Conversely, aiming for 100% test coverage on UI components slows development to a crawl. This strategy provides the pragmatic middle ground.

## 3. Example Structure
- **Testing Pyramid**: Unit vs Integration vs E2E.
- **Test Environments**: Where tests are run.
- **Coverage Goals**: Acceptable metrics.
- **Tools**: The testing stack.

## 4. Example Content
**The Testing Pyramid**:
1. *Unit Tests (60%)*: Fast, isolated tests for utility functions and core logic (e.g., testing the `calculateSpeedBonus` math function).
2. *Integration Tests (30%)*: Testing Supabase Edge Functions and custom React Hooks (e.g., ensuring `usePresence` correctly connects to a mock channel).
3. *End-to-End (E2E) Tests (10%)*: Slow, comprehensive browser tests for critical paths (e.g., the Login flow, the Matchmaking flow).

**Coverage Goals**:
- *Business Logic (Utils/Edge Functions)*: 90% coverage required.
- *UI Components*: We do not mandate unit testing for standard UI components unless they contain complex internal state. Rely on visual regression or E2E for UI.

**Tools**:
- *Unit/Integration*: Vitest + React Testing Library.
- *E2E*: Cypress or Playwright.
- *DB Testing*: pgTAP for Postgres RLS policies.

## 5. AI Usage Instructions
> [!NOTE]  
> When an AI agent generates a new utility function (e.g., `src/utils/elo.js`), it MUST automatically generate a corresponding `elo.test.js` file using Vitest. It should not waste tokens generating tests for simple `<div className="p-4">` components.

## 6. Developer Usage Instructions
- Never mock the database if you are testing an integration. Use a local Supabase Docker instance to test against real Postgres.
- A PR that adds new core business logic will be rejected if it does not include unit tests.

## 7. Best Practices
- **Do**: Write tests that focus on user behavior, not implementation details.
- **Don't**: Write tests that are tightly coupled to CSS class names (which change often). Use `data-testid` attributes.

## 8. Maintenance Strategy
- **Owner**: QA Lead / Tech Lead.
- **Update Frequency**: Bi-annually.
- **Trigger**: Switching testing frameworks or CI/CD pipelines.
