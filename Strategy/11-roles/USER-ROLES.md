# User Roles

## 1. Purpose
Defines the hierarchical structure of user identities within the application. It establishes the baseline "types" of users that exist within the B2B2C ecosystem.

## 2. Why It Matters
If roles are not clearly defined, authorization logic becomes a messy web of `if (user.isTeacher || user.isAdmin || user.canEdit)` checks. Defining distinct roles ensures a clean, extensible RBAC (Role-Based Access Control) architecture.

## 3. Example Structure
- **Role Name**: The canonical identifier.
- **Global vs Tenant**: Does the role apply to the whole app, or just one organization?
- **Hierarchy Level**: Where it sits in the power structure.
- **Primary Persona**: Which persona (from `USER-PERSONAS.md`) occupies this role.

## 4. Example Content
**Role 1: SuperAdmin (Global)**
- *Hierarchy*: Tier 0 (Highest).
- *Scope*: System-wide.
- *Persona*: Internal EduRank Engineers/Founders.
- *Description*: Has absolute read/write access to all tenants. Can impersonate users.

**Role 2: TenantAdmin (Tenant)**
- *Hierarchy*: Tier 1.
- *Scope*: Scoped strictly to one `organization_id` (University).
- *Persona*: University IT or Dean.
- *Description*: Can manage billing, global university settings, and invite Faculty.

**Role 3: Faculty (Tenant)**
- *Hierarchy*: Tier 2.
- *Scope*: Scoped to an `organization_id` and specific `department_ids`.
- *Persona*: Professor Davis.
- *Description*: Can create questions, view analytics, and resolve disputes.

**Role 4: Student (Tenant)**
- *Hierarchy*: Tier 3 (Lowest).
- *Scope*: Scoped to an `organization_id`.
- *Persona*: Alex the Competitor.
- *Description*: Can only play matches and view their own public profile.

## 5. AI Usage Instructions
> [!CAUTION]  
> AI agents MUST use these exact role names when generating Row Level Security (RLS) policies or frontend route guards. The roles should be stored in the JWT `app_metadata` object, NOT in a separate database lookup on every page load.

## 6. Developer Usage Instructions
- Never hardcode user email addresses to grant admin privileges. Always assign the `SuperAdmin` role.
- Assume every user is a `Student` by default until proven otherwise by the JWT.

## 7. Best Practices
- **Do**: Keep the number of roles small. If a role is only slightly different from another, consider using Permissions instead of creating a whole new Role.
- **Don't**: Mix global roles with tenant roles. A `TenantAdmin` has zero power outside their specific university.

## 8. Maintenance Strategy
- **Owner**: Security Lead / Product Manager.
- **Update Frequency**: Annually.
- **Trigger**: Expanding the B2B model to include new user types (e.g., "Parent" accounts).
