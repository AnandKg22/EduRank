# Compliance

## 1. Purpose
Maps the software architecture to specific legal and regulatory frameworks. It acts as the translation layer between legal requirements and engineering implementation.

## 2. Why It Matters
When selling B2B software to large universities or enterprises, the Procurement Department will ask: "Are you SOC2 compliant? Are you FERPA compliant?" If the engineering team hasn't built compliance into the architecture, the deal falls through.

## 3. Example Structure
- **Target Frameworks**: SOC2, GDPR, FERPA, HIPAA.
- **Compliance Controls**: How we satisfy specific legal clauses.
- **Audit Cadence**: How often we are externally reviewed.

## 4. Example Content
**Target Frameworks**:
1. *FERPA (Family Educational Rights and Privacy Act)*: Required for US Universities.
2. *GDPR (General Data Protection Regulation)*: Required for EU users.
3. *SOC 2 Type II*: Target for Q4 2027 to unlock Enterprise contracts.

**Compliance Controls (FERPA)**:
- *Requirement*: Schools must have direct control over educational records.
- *Implementation*: University Admins (TenantAdmins) have the ability to forcefully reset passwords, export data, and delete student accounts within their `organization_id` bypassing standard user consent.

**Compliance Controls (SOC 2)**:
- *Requirement*: Logical access must be restricted.
- *Implementation*: Enforced via `SECURITY-POLICIES.md` and automated Vercel/Supabase 2FA enforcement.

## 5. AI Usage Instructions
> [!NOTE]  
> If an AI agent proposes adding a third-party tracking script (like Facebook Pixel or Google Analytics), it should warn the user: "Adding this tracker may violate GDPR compliance if not gated behind a Cookie Consent banner. Proceed?"

## 6. Developer Usage Instructions
- Do not bypass security controls (like RLS) just to make a feature work faster. You are breaking legal compliance.
- Document any third-party data processors you add to the stack, as Legal needs to update the Privacy Policy.

## 7. Best Practices
- **Do**: Build a central `consent` table to track when a user agreed to the Terms of Service.
- **Don't**: Assume compliance is just a Legal problem. It is fundamentally an Engineering problem.

## 8. Maintenance Strategy
- **Owner**: Legal Counsel / Chief Technology Officer.
- **Update Frequency**: Bi-annually.
- **Trigger**: Entering the Enterprise B2B sales motion.
