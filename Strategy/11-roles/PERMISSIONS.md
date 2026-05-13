# Permissions

## 1. Purpose
Breaks down high-level User Roles into granular, specific actions. While a Role says *who* you are, a Permission says *what* you can do.

## 2. Why It Matters
Roles are often too broad. If a University wants a "Teaching Assistant" who can grade disputes but cannot create new questions, creating a whole new Role is overkill. An ABAC (Attribute/Permission-Based Access Control) layer allows for fine-grained toggling.

## 3. Example Structure
- **Permission Key**: The exact string used in code.
- **Description**: What it allows.
- **Default Roles**: Which roles get this automatically.

## 4. Example Content
**Content Management**:
- `questions:create` - Allow creating new trivia questions. (Default: Faculty).
- `questions:delete` - Allow deleting existing questions. (Default: Faculty).
- `questions:approve` - Allow moving a question from draft to live. (Default: TenantAdmin).

**User Management**:
- `users:invite` - Allow sending platform invites. (Default: TenantAdmin).
- `users:ban` - Allow suspending a student account. (Default: Faculty, TenantAdmin).

**Gameplay**:
- `match:play_ranked` - Allow entering the ELO matchmaking queue. (Default: Student).
- `match:spectate` - Allow watching a live match without participating. (Default: Faculty).

## 5. AI Usage Instructions
> [!TIP]  
> When an AI generates a UI component (like a "Delete" button), it should wrap the component in a permission check rather than a role check. 
> *Incorrect*: `if (user.role === 'faculty') render <DeleteButton />`
> *Correct*: `if (user.permissions.includes('questions:delete')) render <DeleteButton />`

## 6. Developer Usage Instructions
- Enforce permissions strictly on the backend. The frontend UI check is only for UX (hiding buttons), the backend prevents the actual execution.
- Group permissions logically using a `domain:action` syntax.

## 7. Best Practices
- **Do**: Cache permissions in the user session state to prevent constant DB lookups.
- **Don't**: Hardcode permissions into Postgres RLS if they change frequently. Map roles in RLS, and handle granular permissions in Edge Functions or UI.

## 8. Maintenance Strategy
- **Owner**: Tech Lead.
- **Update Frequency**: Every sprint.
- **Trigger**: Creation of new administrative capabilities or edge-case user types.
