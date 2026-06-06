# External Provider Setup

This document covers the provider credentials required before the MVP app can run provider-dependent flows. Do not commit real secrets. Start from `.env.example`, create a local `.env.local`, and fill values outside version control.

## Required App Environment

The app must fail during startup or deployment validation when any required runtime value is missing.

Required for browser and server Supabase access:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Required for Kakao place search:

- `KAKAO_REST_API_KEY`
- `KAKAO_LOCAL_API_BASE_URL`, defaulting to `https://dapi.kakao.com`

Required for operator handoff of Auth provider setup:

- `SUPABASE_AUTH_KAKAO_CLIENT_ID`
- `SUPABASE_AUTH_KAKAO_CLIENT_SECRET`
- `SUPABASE_AUTH_GOOGLE_CLIENT_ID`
- `SUPABASE_AUTH_GOOGLE_CLIENT_SECRET`
- `SUPABASE_AUTH_NAVER_PROVIDER_ID`, defaulting to `custom:naver`
- `SUPABASE_AUTH_NAVER_CLIENT_ID`
- `SUPABASE_AUTH_NAVER_CLIENT_SECRET`

Run the local validation script before starting the app:

```bash
node scripts/validate-env.mjs .env.local
```

## Supabase Auth Providers

Configure OAuth providers in the Supabase Dashboard under `Authentication > Sign In / Providers`. Supabase shows the provider callback URL in each provider's settings. For hosted projects it has the form:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

When testing with the Supabase CLI locally, also register:

```text
http://localhost:54321/auth/v1/callback
```

Add the app callback route, for example `http://localhost:3000/auth/callback`, to the Supabase redirect allow list before wiring client login buttons.

### Kakao Auth

Use Supabase's built-in Kakao provider.

1. Create or select an app in Kakao Developers.
2. Copy the Kakao `REST API key`; this is the Supabase Kakao client ID.
3. Enable Kakao Login and activate the Kakao Login client secret.
4. Register the Supabase Auth callback URL in Kakao Login redirect URIs.
5. In Supabase, enable Kakao and enter the client ID and client secret.
6. Request `profile_nickname` and `profile_image` in the Kakao/Supabase provider settings. Do not request `account_email`; the app collects email in the profile setup form after social sign-in. Enable Supabase's setting that allows users without email for Kakao.

If Kakao Login fails with `KOE205`, check Kakao Developers > Kakao Login > Consent Items and the Supabase Kakao provider configuration. Kakao returns `invalid_scope` when the authorization URL requests a scope that is not enabled for the Kakao app. Remove unavailable scopes such as `account_email`, or enable the matching Kakao consent item before testing again.

Reference: https://supabase.com/docs/guides/auth/social-login/auth-kakao/

### Google Auth

Use Supabase's built-in Google provider.

1. Create or select a Google Cloud project.
2. Configure the OAuth consent screen and required profile scopes.
3. Create an OAuth client for a web application.
4. Register the Supabase Auth callback URL as an authorized redirect URI.
5. In Supabase, enable Google and enter the Google client ID and client secret.

Reference: https://supabase.com/docs/guides/auth/social-login/auth-google

### Naver Auth

Supabase does not currently list Naver as a built-in social provider. Configure Naver as a Supabase custom OAuth/OIDC provider with the provider identifier stored in `SUPABASE_AUTH_NAVER_PROVIDER_ID`; use `custom:naver` unless a different identifier is intentionally chosen.

1. Create a Naver Login application and obtain its client ID and client secret.
2. Create a custom provider in Supabase Auth Providers.
3. Use a `custom:` identifier, preferably `custom:naver`.
4. Register the callback URL shown by Supabase in the Naver application.
5. Configure the Naver authorization, token, and userinfo endpoints from Naver's current developer documentation.
6. Sign in from the app with `signInWithOAuth({ provider: 'custom:naver' })`.

References:

- https://supabase.com/docs/guides/auth/custom-oauth-providers
- https://developers.naver.com/docs/login/overview/overview.md

## Kakao Local API

Place registration uses Kakao Local keyword search as the primary lookup path. The app should call:

```text
GET https://dapi.kakao.com/v2/local/search/keyword.json
Authorization: KakaoAK <KAKAO_REST_API_KEY>
```

Persist the provider metadata already represented in the schema:

- `provider = 'kakao'`
- `provider_place_id`
- `name`
- `provider_category_name`
- `address`
- `road_address`
- `latitude`
- `longitude`
- `place_url`

Expected limitations:

- Kakao Local API quota and rate limits are controlled by the Kakao Developers app settings and plan.
- Results are keyword and region sensitive; the app must still allow manual place creation when search does not find the desired place.
- Manual places must not appear in explore until approved or matched to Kakao, per `docs/product-decisions.md`.

Reference: https://developers.kakao.com/docs/latest/en/local/dev-guide#search-by-keyword

## Supabase Storage

The initial schema creates a private `review-photos` bucket and storage policies for review photo visibility. Keep the bucket private.

Expected bucket configuration:

- Bucket ID: `review-photos`
- Public bucket: `false`
- Object path convention: `<auth.uid()>/<generated-file-name>`
- Allowed app-level photo kinds: `place_food`, `couple_private`

Visibility rules:

- Couple members can read their own couple's review photos.
- Friend and explore surfaces may read only `place_food` photos when the related couple place is public-ready.
- `couple_private` photos must never be exposed through friend or explore surfaces.

The database migration owns the bucket creation and RLS policies. Supabase dashboard changes should not weaken those policies.
