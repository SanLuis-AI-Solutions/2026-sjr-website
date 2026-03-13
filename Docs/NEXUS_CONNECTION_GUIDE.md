# SJR Content Nexus: Connection & Token Guide

Use this guide to activate the real provider connections behind the Connections tab in `/admin/nexus`.

## Current Reality
| Platform | Current Path | Status | Where It Lives |
| :--- | :--- | :--- | :--- |
| **Google Business Profile** | In-app OAuth connect + refresh token storage + real post dispatch | Production-ready | `public.nexus_config` or env fallback |
| **Meta** | Manual token only | Deferred | `NEXUS_META_ACCESS_TOKEN` |
| **Pinterest** | Manual token only | Deferred | `NEXUS_PINTEREST_ACCESS_TOKEN` |
| **LinkedIn** | Manual token only | Deferred | `NEXUS_LINKEDIN_ACCESS_TOKEN` |
| **X** | Manual token only | Deferred | `NEXUS_X_ACCESS_TOKEN` |

---

## Google Business Profile

### What now works
1. Go to `/admin/nexus?view=connections`.
2. Click **Connect** on the Google row.
3. Complete Google OAuth consent.
4. Nexus stores:
   - access token
   - refresh token
   - token metadata
   - selected account + location resource
5. `/api/v1/nexus/sync` can then use that stored connection for real GBP posting.
6. `Mission Control > Publishing` can now:
   - open the full article directly from the queue
   - save an approved draft in `public.nexus_publish_queue`
   - publish the approved row live

### Required env
- `NEXUS_GBP_CLIENT_ID`
- `NEXUS_GBP_CLIENT_SECRET`
- `NEXUS_OAUTH_BASE_URL`

Accepted fallback for local development:
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`

Optional manual fallback:
- `NEXUS_GBP_ACCESS_TOKEN`
- `NEXUS_GBP_LOCATION_NAME`

`NEXUS_GBP_LOCATION_NAME` should be the full resource path:
`accounts/{accountId}/locations/{locationId}`

### Google Cloud setup
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the Business Profile APIs required for your approved project.
3. Create a Web OAuth client.
4. Add the correct redirect URI:
   - local example: `http://localhost:3000/api/auth/social/gbp/callback`
   - production example: `https://www.susiesjewelryrepair.com/api/auth/social/gbp/callback`
5. Make sure the OAuth client is allowed to request:
   - `https://www.googleapis.com/auth/business.manage`

### Verification path
1. Visit `/admin/nexus?view=connections`.
2. Click **Connect** for Google.
3. Confirm the browser redirects to Google Accounts OAuth.
4. After consent, verify the Connections tab shows Google as connected.
5. Open `/admin/nexus?view=publishing`.
6. Confirm each queue row exposes:
   - the post title
   - an `Open post` action
   - `Save approved draft`
   - `Publish now`
7. Open the article in full from the queue and review it there.
8. Click **Save approved draft**.
9. Click **Publish now**.
10. Confirm:
   - `public.nexus_publish_queue` updates
   - `shared_slugs` updates
   - the Publishing workspace reflects the live result

---

## Other Providers

These buttons are intentionally honest placeholders right now. They do not have completed OAuth or posting adapters in this pass.

### Meta
- still manual token-driven
- future work: real OAuth, page selection, page post adapter

### Pinterest
- still manual token-driven
- future work: board selection + pin creation adapter

### LinkedIn
- still manual token-driven
- future work: organization/member selection + post adapter

### X
- still manual token-driven
- future work: OAuth + post adapter

---

## Storage + Security Notes
- Provider connection state now persists in `public.nexus_config`.
- `public.nexus_config` should remain protected with RLS enabled.
- Publishing approval state now persists in `public.nexus_publish_queue`.
- `public.nexus_publish_queue` should remain protected with RLS enabled.
- Publish result state is written into `shared_slugs` so Mission Control can surface live platform status.

---

Need help with the next provider:
- ask for a provider-specific implementation pass instead of adding placeholder buttons
