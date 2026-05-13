# Audience Overview

## 1. Purpose
Provides a high-level categorization of the macro-audience the product serves. It helps engineering and design teams understand the demographic spread and technical proficiency of the user base.

## 2. Why It Matters
A platform built for Gen-Z engineering students needs a drastically different UX (high-density data, keyboard shortcuts, gamification) than a platform built for 60-year-old administrative staff. Knowing the audience prevents mismatched UX paradigms.

## 3. Example Structure
- **Primary Audience**: The core user who spends the most time in the app.
- **Secondary Audience**: The supporting user (admin, evaluator, buyer).
- **Demographics**: Age range, tech-literacy, device preferences.

## 4. Example Content
**Primary Audience**: Engineering Undergraduate Students (Age 18-24).
- *Tech Literacy*: Very high. Expects sub-second load times and dark mode by default.
- *Device Preference*: 60% Mobile (playing on the go), 40% Desktop/Laptop (serious rank climbing).
**Secondary Audience**: University Faculty and Deans (Age 35-65).
- *Tech Literacy*: Variable. Needs clear, explicit UI controls and exportable CSV reports.
- *Device Preference*: 95% Desktop.

## 5. AI Usage Instructions
> [!NOTE]  
> When an AI agent generates a UI component, it must check which audience the component serves.
> - If for Students: Bias toward mobile-first, gestures, and minimal text.
> - If for Faculty: Bias toward data-density, data-tables, and explicit "Save/Export" buttons.

## 6. Developer Usage Instructions
- Never assume an administrative dashboard needs to be mobile-optimized unless specifically requested, as the Secondary Audience is 95% Desktop.

## 7. Best Practices
- **Do**: Validate technical assumptions against audience demographics (e.g., relying on WebGL might be fine for students, but terrible for faculty on old school-issued laptops).
- **Don't**: Ignore accessibility, even if the primary audience is young. WCAG compliance is mandatory.

## 8. Maintenance Strategy
- **Owner**: Product Manager / UX Lead.
- **Update Frequency**: Annually.
- **Trigger**: Expanding into new markets (e.g., High Schools instead of Universities).
