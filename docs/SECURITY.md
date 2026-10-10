# Security and deployment checklist

## Required before deploying administrator features

**Application authorization and database authorization must be deployed together.** The site now requires the verified user's `app_metadata.portfolio_admin` to be the boolean `true`. Existing accounts without this claim cannot open the admin UI or admin APIs. No production database, account, bucket, or policy was changed during this implementation.

The original SQL allowed any authenticated user to manage shared site data and the login page offered public registration. Hiding registration or guarding a Next.js page does not protect direct Supabase Data API calls. The reviewed `supabase-security-hardening.sql` adds restrictive RLS policies, preserving existing author/public policies and content rows. It has not been executed or tested against the production database.

Deployment order:

1. Back up the database and inspect the actual policies in the Supabase dashboard. The repository scripts are evidence of intended configuration, not proof of deployed configuration. Check any existing `portfolio_*` policies and `public.is_portfolio_admin()` function before applying the script: it replaces these names, so locally added behavior must be reconciled first.
2. In a trusted Supabase SQL Editor session, identify the existing owner's UUID from Authentication → Users. Merge the claim using the statement below. Replace the placeholder UUID; never run a blanket update. Do not place a service role key in this app.
3. Disable public signups in Supabase Authentication settings. Password and magic-link sign-in for existing accounts remain supported.
4. Review and run `supabase-security-hardening.sql`. It refuses to proceed if there is no administrator claim. Missing optional tables are reported and skipped; rerun the script after enabling one of those features. The script adds restrictive policies; existing permissive policies are still necessary to grant the intended public/owner access.
5. Sign out and back in to refresh the JWT. Test owner access, an ordinary authenticated account, and anonymous access in a staging project. Tokens issued before a claim is revoked can keep that claim until expiry; use a short appropriate session lifetime and revoke sessions when removing access.
6. Set allowed authentication redirect URLs to `http://localhost:3000/auth/callback` for development and `https://cdytim.vercel.app/auth/callback` for production. Magic links use PKCE code exchange; request and open the link in the same browser. Ensure the email template respects the configured redirect URL.
7. Configure `CRON_SECRET` before enabling the existing Vercel cron. The cron now returns `503` when the secret is absent and `401` for an invalid bearer token. Use a randomly generated secret of at least 32 bytes. No secret is required for public pages.

```sql
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
  || '{"portfolio_admin": true}'::jsonb
WHERE id = 'REPLACE-WITH-EXISTING-OWNER-UUID'::uuid;
```

Do not use `user_metadata` for authorization: the user can change it. Application checks use `auth.getUser()` and the database checks the signed JWT's trusted app metadata. Admin server pages and every admin API verify authorization independently; the Proxy refreshes sessions and does not substitute for these checks. Public reads use a separate anonymous client so a logged-in administrator cannot leak drafts into a public page.

## Inputs and content

- Admin APIs whitelist editable fields, reject immutable/unknown fields, bound text/array/body sizes, validate positive integer IDs and HTTP(S) URLs, and do not return raw database errors. Mutation requests reject foreign origins and non-JSON bodies. Post changes additionally filter by the verified author ID.
- Resume URLs are validated at write and read time. Invalid existing values use the original known Google Drive resume link.
- Blog and diary Markdown use `react-markdown` without raw HTML plugins; comments render as escaped React text. Raw HTML and executable URL schemes are not enabled. Spotify frames accept only 22-character track IDs and have accessible titles.
- Upload controls accept JPEG, PNG, WebP, GIF, or AVIF, from 1 byte to 5 MB. Configure **the same allowed MIME types and 5 MB file size limit in the `blog-images` bucket**; browser checks alone are not a security boundary.
- Comments remain anonymous and are inserted through Supabase to preserve the current feature. RLS limits them to published posts and bounds name/content lengths. Analytics accepts bounded input; the app removes URL query strings and records referrer origins only, skips private routes, and respects Do Not Track / Global Privacy Control.
- No per-process rate limiter is claimed to protect serverless production. Anonymous comment/analytics inserts can still be spammed through the Supabase Data API. Use gateway-level rate controls, CAPTCHA, or a moderated server-only insertion workflow if abuse appears. This would require a separate database/access change.

## Existing limitations preserved explicitly

**Private diary media are not private.** The existing editor uploads diary images into the public `blog-images` bucket. Diary rows are author-only, but anyone with an image URL can fetch that image. This change does not move or delete existing assets. A future private bucket and signed-URL rendering migration must include existing content references before claiming private media support.

Diary-to-blog publishing consists of multiple writes, not a database transaction. Failures are surfaced and known IDs retained for retry, but transactional atomicity requires a reviewed SQL function and a follow-up deployment. Category ordering similarly uses sequential updates.

There are no production credentials in the repository. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is intentionally public and depends on RLS. The config rejects obvious `sb_secret_` and legacy `service_role` credentials. Production integrations, actual RLS behavior, email delivery, uploads, and signed-in journeys require a configured staging/production project to verify; offline tests do not prove deployed access control.

## Verification matrix for the operator

| Actor | Expected access after the hardening script |
| --- | --- |
| Anonymous | Published posts, public categories/experiences/resume; comments on published posts; bounded analytics insert |
| Authenticated ordinary account | Same public access; no admin UI/API, no CMS/storage modification, no analytics read |
| Portfolio admin | Manage shared site content; create/edit/delete own posts; read/edit own private diaries; moderate comments; read analytics |
| Other admin | Cannot read another author's diary or change another author's posts |

Test both HTTP routes and direct Supabase requests: UI checks alone are insufficient. Also test revoked claims after session refresh, malformed JSON, oversized payloads, cross-origin mutations, `javascript:` URLs, draft visibility, and missing environment variables.

## References

- [Supabase SSR authentication](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase user metadata and trusted app metadata](https://supabase.com/docs/guides/auth/users)
