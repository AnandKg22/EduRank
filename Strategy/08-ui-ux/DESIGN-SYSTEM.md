# Design System

## 1. Purpose
Establishes the foundation for all visual components. It maps abstract brand guidelines (from `BRAND.md`) into concrete, reusable code tokens (Tailwind classes, CSS variables) to ensure UI consistency at scale.

## 2. Why It Matters
Without a design system, a project will end up with 15 different shades of blue, 8 different button padding configurations, and inconsistent border radiuses. A design system turns design into mathematics, drastically speeding up frontend development.

## 3. Example Structure
- **Design Tokens**: The base CSS variables (colors, spacing, typography).
- **Core Components**: Buttons, Inputs, Cards.
- **Complex Patterns**: Modals, Data Tables, Navbars.
- **Animation Primitives**: Standard durations and easing curves.

## 4. Example Content
**Design Tokens (Tailwind Configuration)**:
- *Spacing Scale*: strict `4px` grid (e.g., `p-1` = 4px, `p-4` = 16px). Do not use arbitrary values like `p-[13px]`.
- *Border Radius*: Default `rounded-lg` (8px). Modals use `rounded-xl`.

**Core Component: Button**:
- *Primary*: `bg-brand-violet text-white hover:bg-brand-violet/90 transition-colors`.
- *Secondary*: `bg-transparent border border-white/20 hover:border-white/40`.
- *Sizing*: `h-10 px-4` (Standard), `h-12 px-6` (Large).

**Animation Primitives**:
- *Fast* (Hover effects): `duration-150 ease-out`.
- *Medium* (Modals opening): `duration-300 ease-spring`.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When an AI agent generates a React component, it MUST utilize the Tailwind utility classes defined in this document. 
> - NEVER generate arbitrary values like `w-[350px]` or `bg-[#4532ff]` unless absolutely necessary. Use the predefined theme tokens.

## 6. Developer Usage Instructions
- Build components in isolation (e.g., using Storybook) before integrating them into the main app.
- If a design mockup uses a shade of color not in the `tailwind.config.js`, push back on the designer rather than adding a custom hex code.

## 7. Best Practices
- **Do**: Export all base components from a single folder (e.g., `src/components/ui/`).
- **Don't**: Write custom CSS files unless implementing complex keyframe animations that Tailwind cannot handle cleanly.

## 8. Maintenance Strategy
- **Owner**: Frontend Lead / Lead UI Designer.
- **Update Frequency**: Every sprint (adding new components).
- **Trigger**: Expanding the component library (e.g., adding a DatePicker).
