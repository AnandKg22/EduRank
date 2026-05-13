# Business Model

## 1. Purpose
Explains exactly how the product interacts with the market, who the ultimate buyer is, and what the core value exchange consists of.

## 2. Why It Matters
Developers need to know if they are building a B2C (Business to Consumer) viral app or a B2B (Business to Business) enterprise tool. This fundamentally changes how user onboarding, organizational structures, and data privacy are architected.

## 3. Example Structure
- **Model Type**: B2B, B2C, B2B2C, Marketplace, SaaS.
- **The Buyer**: Who writes the check?
- **The User**: Who actually uses the software?
- **Value Proposition**: Why do they buy/use it?

## 4. Example Content
**Model Type**: B2B2C (Business to Business to Consumer).
**The Buyer**: University Deans and Department Heads who purchase institutional licenses.
**The User**: Engineering students who play the game, and Faculty who monitor the analytics.
**Value Proposition**: We provide Universities with high-engagement assessment tools that students actually want to use, giving Deans real-time data on departmental academic health.

## 5. AI Usage Instructions
> [!WARNING]  
> When an AI agent generates database schemas for "Users", it must immediately account for the B2B2C model. 
> - Users must belong to `Organizations` or `Universities`. 
> - Roles must differentiate between the Buyer (Admin) and the User (Student).

## 6. Developer Usage Instructions
- Always ensure that user data is logically segregated by Institution. Cross-tenant data leakage in a B2B model is a catastrophic failure.

## 7. Best Practices
- **Do**: Keep the distinction between Buyer and User crystal clear.
- **Don't**: Treat B2B onboarding the same as B2C. B2B requires organization invites, SAML/SSO, and role provisioning.

## 8. Maintenance Strategy
- **Owner**: Chief Revenue Officer / Product Lead.
- **Update Frequency**: Annually.
- **Trigger**: Launching new market segments (e.g., shifting from Universities to Corporate Training).
