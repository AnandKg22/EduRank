# Notification Flows

## 1. Purpose
Standardizes how, when, and where the system communicates with the user outside of the immediate UI. It governs push notifications, emails, SMS, and in-app bell notifications.

## 2. Why It Matters
Notification spam causes users to immediately revoke permissions or uninstall the app. Notification silence causes users to churn because they forget the app exists. This document enforces the balance.

## 3. Example Structure
- **Notification Type**: Transactional, Promotional, or Alert.
- **Channels**: Email, SMS, In-App, Push.
- **Urgency Matrix**: What dictates the channel used?
- **Opt-Out Rules**: Legal compliance for unsubscribing.

## 4. Example Content
**Urgency Matrix**:
- *Critical (Match Found, Password Reset)*: Push Notification + In-App. (Instant delivery required).
- *High (Direct Message, Rank Dropped)*: Push Notification.
- *Medium (Weekly Analytics Report)*: Email only.
- *Low (New Feature Announcement)*: In-App only.

**Channels Config**:
- *Email*: Handled via Resend API (Triggered by Supabase Edge Functions).
- *Push*: Handled via Firebase Cloud Messaging (FCM) / Web Push API.

**Opt-Out Rules**:
- Transactional emails (e.g., Password Reset) cannot be opted out of.
- Promotional emails MUST include a 1-click unsubscribe link.
- Push notifications must be explicitly requested. Provide a "Why we need this" UI primer before asking the browser for permission.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When an AI agent writes backend logic that triggers a state change, it should reference the Urgency Matrix. If the event is "Medium", the AI should write an integration to the Email service, NOT a Push Notification.

## 6. Developer Usage Instructions
- Never fire a Push Notification directly from a client device to another client device. Always route through the secure backend to prevent abuse.
- Consolidate notifications. If a user receives 5 challenge requests in 1 hour, send 1 batch email, not 5 separate emails.

## 7. Best Practices
- **Do**: Store all notification templates (Email HTML, Push text) in the backend, not hardcoded in the frontend.
- **Don't**: Send push notifications between 10 PM and 8 AM in the user's local timezone unless it is a critical security alert.

## 8. Maintenance Strategy
- **Owner**: Marketing / Product Manager.
- **Update Frequency**: Quarterly.
- **Trigger**: High unsubscribe rates or changes to communication platforms (e.g., moving from SendGrid to Resend).
