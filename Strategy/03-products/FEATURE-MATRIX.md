# Feature Matrix

## 1. Purpose
A comprehensive mapping of all system features against the Pricing Tiers, User Roles, and Product Lines. It is the definitive source of truth for what a user is allowed to do.

## 2. Why It Matters
Without a matrix, authorization logic scatters across the codebase. A developer might hide a button on the UI, but forget to secure the API endpoint. This matrix provides the blueprint for unified RBAC (Role-Based Access Control) and feature flagging.

## 3. Example Structure
A table or grid format is best:
- **Feature Name**: E.g., "Export Analytics to CSV".
- **Free Tier**: Yes/No.
- **Pro Tier**: Yes/No.
- **Student Role**: Yes/No.
- **Faculty Role**: Yes/No.

## 4. Example Content
| Feature | Basic Tier | Enterprise Tier | Student Role | Faculty Role |
| :--- | :--- | :--- | :--- | :--- |
| **Play Ranked Matches** | Yes | Yes | Yes | No |
| **View Own History** | Last 10 | Unlimited | Yes | No |
| **Upload Custom Qs** | No | Yes | No | Yes |
| **Download CSV Reports**| No | Yes | No | Yes |

## 5. AI Usage Instructions
> [!CAUTION]  
> Before an AI writes *any* database mutation or API route, it must cross-reference this matrix. 
> - If generating the `Upload Custom Qs` endpoint, the AI must automatically insert Row Level Security (RLS) or middleware checks ensuring `user.role === 'faculty'` and `tenant.tier === 'enterprise'`.

## 6. Developer Usage Instructions
- Treat this matrix as law. If a PM asks for a feature to be moved from Enterprise to Basic, update this file *before* changing the code.
- Implement these checks at both the UI level (hiding buttons) and the DB level (RLS policies).

## 7. Best Practices
- **Do**: Keep the feature names explicit and granular.
- **Don't**: Assume UI hiding is enough security. Always back the matrix up with server-side validation.

## 8. Maintenance Strategy
- **Owner**: Product Manager / Security Lead.
- **Update Frequency**: Every release.
- **Trigger**: New features being deployed to production or pricing model changes.
