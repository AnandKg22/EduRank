# Brand Guidelines

## 1. Purpose
Defines the visual, tonal, and thematic identity of the product. It ensures consistency across all user touchpoints, from UI components to transactional emails and marketing copy.

## 2. Why It Matters
A disjointed brand destroys trust. If the landing page looks like a modern esports platform but the dashboard looks like a 1990s banking app, users will bounce. This document guarantees that AI agents and UI developers pull from the exact same thematic palette.

## 3. Example Structure
- **Brand Personality**: How the brand "speaks" and "feels".
- **Color Palette**: Primary, Secondary, Accents, and Semantic colors (Hex codes).
- **Typography**: Primary and Secondary font families.
- **Imagery & Iconography**: Style of illustrations, borders, and icons.

## 4. Example Content
**Personality**: High-energy, Competitive, Academic, Sleek. We speak like an esports commentator, not a boring professor.
**Palette**:
- *Primary (Brand)*: Electric Violet `#6D28D9`
- *Background (Dark Mode Only)*: Void Black `#0B0B0F`
- *Accent (Success/Speed)*: Neon Green `#10B981`
- *Accent (Warning/Damage)*: Crimson `#EF4444`
**Typography**:
- *Headings*: `Orbitron` (For rank names, big scores).
- *Body*: `Inter` (For readability on questions).
**Style**: Glassmorphism, subtle neon glows on active elements, sharp edges (no heavily rounded corners).

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When generating UI code (Tailwind, CSS), AI agents MUST utilize the exact color hexes and typography specified here. 
> - Do not use generic "blue-500". Use the semantic brand colors.
> - When generating copywriting (error messages, empty states), use the "Competitive, High-energy" tone.

## 6. Developer Usage Instructions
- All brand variables should be mapped to CSS variables or a Tailwind config file (`tailwind.config.js`). Do not hardcode hex values in components.
- Review empty states and loading screens to ensure they convey the brand personality.

## 7. Best Practices
- **Do**: Build a centralized UI component library reflecting these rules.
- **Don't**: Introduce new colors to the app without updating this document and the Tailwind config.

## 8. Maintenance Strategy
- **Owner**: Lead Designer.
- **Update Frequency**: Only during brand refreshes.
- **Trigger**: Major redesigns or introduction of a light-mode theme.
