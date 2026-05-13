# UI Standards

## 1. Purpose
Defines the strict rules for how components are laid out on a page, how forms are validated, and how loading/error states are presented to the user.

## 2. Why It Matters
Even with a perfect Design System (buttons, inputs), developers can still create terrible UI by laying those components out poorly (e.g., submitting a form without a loading spinner, or having text touch the edge of the screen). UI Standards enforce the layout logic.

## 3. Example Structure
- **Layout & Grids**: Page margins, max-widths, and grid columns.
- **Form Validation**: When and how to show errors.
- **State Management**: Loading, Empty, and Error states.
- **Responsive Behavior**: Mobile vs Desktop breakpoints.

## 4. Example Content
**Layout & Grids**:
- All main content must be wrapped in a `<Container>` component with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Dashboards use a standard 12-column grid layout.

**Form Validation**:
- Do not show inline validation errors until the user has `blurred` the input field or submitted the form.
- Use `react-hook-form` + `zod` for all form logic.

**State Management**:
- *Loading*: Prefer skeleton loaders over full-page spinners for data fetching. Use spinners only for mutating actions (like saving a profile).
- *Empty*: Every list or table MUST have an empty state illustration and a Call-To-Action (e.g., "No battles found. Click here to find a match!").

**Responsive Behavior**:
- Mobile-first approach. Default classes are for mobile. Use `md:` for tablet, `lg:` for desktop.

## 5. AI Usage Instructions
> [!WARNING]  
> If an AI agent generates a data-fetching component, it MUST automatically include handling for `isLoading` (returning skeletons) and `isEmpty` (returning a friendly empty state). It must not just return `null` while loading.

## 6. Developer Usage Instructions
- Never rely on `window.alert()` or default browser `alert/confirm` dialogs. Always use the custom Toast or Modal components.
- Review your UI on a simulated mobile device before opening a PR.

## 7. Best Practices
- **Do**: Keep forms short. Break long forms into multi-step wizards.
- **Don't**: Disable submit buttons without explaining *why* they are disabled (use tooltips).

## 8. Maintenance Strategy
- **Owner**: Frontend Lead.
- **Update Frequency**: Quarterly.
- **Trigger**: Identifying recurring UX complaints in user feedback.
