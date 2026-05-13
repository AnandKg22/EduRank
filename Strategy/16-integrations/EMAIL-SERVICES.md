# Email Services

## 1. Purpose
Defines how the application sends transactional and marketing emails, ensuring high deliverability and compliance with anti-spam laws.

## 2. Why It Matters
If password reset emails land in the spam folder, users are permanently locked out of the app. A strict email strategy ensures clean IP reputation and consistent branding.

## 3. Example Structure
- **Provider**: Resend, SendGrid, AWS SES.
- **Template Management**: Where HTML emails are stored.
- **Trigger Mechanisms**: How emails are queued.
- **Deliverability Rules**: DKIM, SPF, DMARC.

## 4. Example Content
**Provider**: Resend (via Edge Functions).

**Template Management**:
- We use React Email to build templates.
- Templates are stored in a dedicated package/folder (`src/emails/`) and compiled to static HTML before being sent via the Resend API.

**Trigger Mechanisms**:
- *Auth Emails* (Magic Links, Reset Password): Handled natively by Supabase Auth (which is configured to use our Resend SMTP credentials).
- *Transactional Emails* (Weekly Analytics, Match Disputes): Triggered via Postgres Webhooks calling an Edge Function.

**Deliverability Rules**:
- Ensure all domains are verified with DKIM and SPF records.
- From addresses must be explicit: `auth@edurank.com` for system emails, `faculty@edurank.com` for reports.

## 5. AI Usage Instructions
> [!NOTE]  
> When an AI agent writes code to trigger an email, it should not hardcode the HTML string in the Edge Function. It should reference a pre-compiled React Email template ID or function.

## 6. Developer Usage Instructions
- Always test email templates in dark mode. Many email clients aggressively invert colors, ruining custom branding.
- Include a plain-text fallback for every HTML email.

## 7. Best Practices
- **Do**: Use localized variables (e.g., `{{userName}}`) in templates to allow for easy translation later.
- **Don't**: Send bulk marketing emails through the transactional IP address. It risks tanking the IP reputation.

## 8. Maintenance Strategy
- **Owner**: Marketing Ops / Backend Developer.
- **Update Frequency**: Annually.
- **Trigger**: Rebranding or moving domains.
