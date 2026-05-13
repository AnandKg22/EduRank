# Accessibility (A11y) Standards

## 1. Purpose
Ensures the software is usable by everyone, including people with visual, motor, auditory, or cognitive disabilities. It mandates compliance with WCAG (Web Content Accessibility Guidelines).

## 2. Why It Matters
In the EdTech and Enterprise SaaS space, accessibility is not optional—it is a legal requirement (e.g., Section 508 in the US). Ignoring accessibility limits the market size and invites lawsuits from institutional buyers.

## 3. Example Structure
- **Compliance Level**: Target WCAG tier.
- **Semantic HTML**: Rules for tags.
- **Keyboard Navigation**: Requirements for non-mouse users.
- **Color & Contrast**: Rules for visual design.

## 4. Example Content
**Compliance Level**: We target **WCAG 2.1 AA** compliance.

**Semantic HTML**:
- Never use a `<div>` with an `onClick` handler. If it's clickable, it MUST be a `<button>` or an `<a>`.
- All forms must have `<label>` elements explicitly linked to `<input>` via the `htmlFor` and `id` attributes.

**Keyboard Navigation**:
- Every interactive element must be reachable via the `Tab` key.
- Focus states must be highly visible (e.g., `focus:ring-2 focus:ring-brand-violet focus:outline-none`). Do not disable outlines without providing a custom focus ring.
- Modals must trap focus (the user cannot tab outside the modal while it is open) and must close on `Escape`.

**Color & Contrast**:
- Text must have a contrast ratio of at least 4.5:1 against its background.
- Never use color alone to convey meaning (e.g., a red error border must also be accompanied by an error icon or text).

## 5. AI Usage Instructions
> [!CAUTION]  
> When generating UI components, AI agents MUST automatically include `aria-*` attributes where necessary (e.g., `aria-expanded` on accordions, `aria-hidden` on decorative icons). They must exclusively use semantic HTML tags.

## 6. Developer Usage Instructions
- Run Axe DevTools or Lighthouse Accessibility audits before submitting any UI-heavy PR.
- Test your features by navigating entirely with your keyboard (mouse unplugged).

## 7. Best Practices
- **Do**: Use `sr-only` (screen-reader only) CSS classes to provide context to screen readers that isn't visually necessary.
- **Don't**: Use `tabindex` greater than 0. Let the DOM order dictate the tab sequence naturally.

## 8. Maintenance Strategy
- **Owner**: Frontend Lead.
- **Update Frequency**: During major UI overhauls.
- **Trigger**: Automated CI/CD accessibility audits failing.
