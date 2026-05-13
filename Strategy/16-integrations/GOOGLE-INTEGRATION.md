# Google Integration

## 1. Purpose
Documents the specific configuration, scopes, and architecture for integrating with Google's ecosystem (OAuth, Google Classroom, Google Drive).

## 2. Why It Matters
In the EdTech sector, Google Workspace integration is table stakes. However, requesting the wrong OAuth scopes can trigger massive security audits and scare users away. This document defines the minimum viable access required.

## 3. Example Structure
- **OAuth Configuration**: Client IDs and Secrets.
- **Requested Scopes**: Exact permissions we ask for.
- **Google Classroom Flow**: Syncing rosters.
- **Security Context**: Handling Google tokens.

## 4. Example Content
**OAuth Configuration**:
- Handled natively via Supabase Auth providers.
- *Client ID*: Configured in the GCP Console under "EduRank Prod".

**Requested Scopes**:
- `email`, `profile`, `openid` (Default).
- *Strict Rule*: Do NOT request Google Drive or Gmail read permissions unless explicitly building an import feature, and even then, use Incremental Authorization.

**Google Classroom Flow (Future)**:
- Faculty users can trigger an import. The system will request the `https://www.googleapis.com/auth/classroom.rosters.readonly` scope.
- We map Google `userId` to our `profiles.id`.

## 5. AI Usage Instructions
> [!IMPORTANT]  
> When an AI agent generates login buttons or auth logic, it MUST default to generating Google OAuth as the primary authentication method, utilizing `@supabase/supabase-js` `signInWithOAuth({ provider: 'google' })`.

## 6. Developer Usage Instructions
- Ensure the OAuth consent screen in GCP is properly branded with the EduRank logo and Privacy Policy to avoid user drop-off.
- Handle edge cases where a user changes their Google profile picture, as we cache that URL in our `profiles` table.

## 7. Best Practices
- **Do**: Use "One Tap" Google login if it improves conversion rates on the marketing site.
- **Don't**: Store raw Google Access Tokens in the frontend.

## 8. Maintenance Strategy
- **Owner**: Backend Lead.
- **Update Frequency**: Annually.
- **Trigger**: Google deprecating APIs or changing their OAuth verification requirements.
