# AccrediTrack Web

AccrediTrack Web is the frontend for the AccrediTrack credential and license tracking application.

It is built with:

- React
- TypeScript
- Vite
- Auth0 for authentication
- Stripe for billing hooks
- Tailwind CSS and daisyUI for UI styling


4242424242424242

## What The Frontend Does

The frontend currently supports:

- Authenticated login flow with Auth0
- Dashboard views for compliance metrics
- Employee management UI
- License type management UI
- Employee license assignment and renewal views
- Settings, support, privacy, terms, and account deletion flows

## Local Development

### Prerequisites

### Install and run

```powershell
npm install
npm run dev
```

The default local frontend URL is:

- `http://localhost:5173`

### One-command local startup (both apps)

From the backend repo root (`../accredi-track`) run either script to start the
backend and frontend together:

```powershell
.\start-dev.ps1   # PowerShell
start-dev.bat     # cmd
```

These scripts:

- Build the backend to a fixed `accredi-track.exe` (instead of `go run`, whose
  fresh temp binary re-triggers the Windows Firewall prompt every launch).
- Start the backend with `HOST=127.0.0.1` so it binds localhost-only. This
  avoids the Windows Firewall "allow network access" prompt entirely. In
  production the `HOST` var is left empty so the server binds all interfaces.
- Start the frontend on `http://localhost:5173`.

## Monitoring the Database (Railway MySQL)

The database lives on Railway and is not publicly exposed. Use the Railway CLI
to open a stable SSH tunnel, then point any client (DBeaver recommended;
MySQL Workbench is crash-prone on Windows) at it:

```powershell
railway connect MySQL --tunnel-only --port 3307
```

This prints connection details and holds the tunnel open until Ctrl+C. Because
the port is pinned to `3307`, a saved client connection keeps working across
sessions. Connect with:

- Host: `127.0.0.1`
- Port: `3307`
- User / Password / Database: as printed by the command (database is `railway`)

To quickly check the pro-subscription state during Stripe testing:

```sql
SELECT email, pro, stripeCustomerId FROM users ORDER BY id DESC;
```

(`pro = 1` means active pro; `2` means cancelled.)

## Operations & Production Runbook

Things that are easy to forget. All CLI commands run from the backend repo root
(`../accredi-track`) with the Railway CLI linked to the `accredi-track` project.

### Production URLs

- Frontend: `https://accreditrack.com` (Railway service `accredi-track-web`,
  also `https://accredi-track-web-production.up.railway.app`)
- Backend/API: `https://accredi-track-production.up.railway.app`
- Backend health check: `.../health` → `{"status":"healthy"}`

### Scheduled jobs (cron)

Two daily jobs are configured on **cron-job.org** (external scheduler). They hit
authenticated backend endpoints. The auth is a shared secret in the
`X-Cron-Key` request header, which must equal the backend's `CRON_API_KEY` env
var (set on the Railway `accredi-track` service). Without a matching key the
endpoint returns 401; if `CRON_API_KEY` is unset the endpoint returns 500.

| Job | Endpoint (GET) | Purpose |
| --- | --- | --- |
| Downgrade cancelled subs | `/check-active-subs` | Reconciles pro users vs active Stripe subscriptions; calls `TurnOffPro` (sets `pro=2`, clears `stripeCustomerId`) for anyone no longer active. This is what removes pro access after a customer cancels — a Stripe cancellation does NOT notify the app on its own. |
| Expiry notifications | `/send-notifications` | Emails owners about expiring/expired licenses. **No-op until Mailgun is configured** (see below). |

To reconfigure a cron job on cron-job.org: URL = the endpoint above, method GET,
add a custom header `X-Cron-Key: <value of CRON_API_KEY on Railway>`. Prefer the
header over the `?key=` query param so the secret doesn't leak into logs.

Manual test of the downgrade job:

```powershell
# Expect 401 without the key, 200 with it.
curl.exe "https://accredi-track-production.up.railway.app/check-active-subs" -H "X-Cron-Key: <CRON_API_KEY>"
```

Verified working: after a real cancellation, this flipped users to `pro=2`,
cleared `stripeCustomerId`, and stamped `cancelled` (confirmed in the DB).

### Email (Mailgun) — sending only, NOT an inbox

Mailgun is a **sending** service. It lets the app send mail *from*
`support@accreditrack.com`; it does NOT give you a mailbox to read replies.

- Sender and domain are set in `go/utils/utils.go`: domain hardcoded to
  `accreditrack.com`, sender `support@accreditrack.com`, API key from env
  `MAILGUN_API_KEY` (Railway backend service).
- To make notifications actually send: verify `accreditrack.com` in Mailgun (add
  the SPF/DKIM DNS records they provide), then set `MAILGUN_API_KEY` on Railway.
  Until then `/send-notifications` runs but sends nothing.
- To RECEIVE mail at `support@accreditrack.com` (read customer replies): the
  domain's MX records already point at Mailgun (`mxa/mxb.mailgun.org`), so use
  **Mailgun Routes** rather than adding another provider. Mailgun dashboard →
  Receiving → Routes → create a route matching recipient
  `support@accreditrack.com` with a "forward" action to your personal inbox.
  No DNS changes needed. (Inbound routes may require a paid Mailgun plan; if so,
  `support@` stays send-only until addressed.) Do NOT point MX at Cloudflare/a
  registrar — that would break the Mailgun sending setup.

### DNS / domain hosting

- Registrar: **Squarespace Domains** (formerly Google Domains — hence the NS1
  `*.nsone.net` nameservers Squarespace inherited). Confirmed via RDAP.
- **DNS records are edited in the Squarespace domain panel** (Domains →
  accreditrack.com → DNS settings), NOT in Railway. The Railway services only
  have their `*.up.railway.app` service domains attached; `accreditrack.com` is
  pointed at Railway via A records managed at Squarespace.
- The Railway CLI/dashboard cannot manage DNS records (MX/TXT/CNAME) — only
  service custom domains. So all record edits happen at Squarespace.
- Current DNS state (verified via lookup):
  - Nameservers: `dns1..4.p01.nsone.net` (NS1, via Squarespace)
  - Root A records: AWS/Railway edge IPs
  - MX: Mailgun (`mxa/mxb.mailgun.org`) — being replaced by ImprovMX for receiving
  - SPF TXT: `v=spf1 include:mailgun.org ~all` (authorizes Mailgun sending — DO
    NOT remove when changing MX)

### ⚠️ DNS changes blocked pending Squarespace account recovery

As of this writing, access to the Squarespace domain account is locked (support
request filed). The site keeps working because DNS records were configured once
(months ago) and DNS is passive — it answers queries without any login. Only
*changing* records (e.g. the ImprovMX MX swap below) requires panel access.
Domain is paid through **2027-04-11**, so there is no urgency. When access is
restored: (1) make the MX change if still wanted, (2) verify `accreditrack.com`
is cleanly attached as a custom domain on the Railway frontend service (the CLI
did not show it attached — it currently resolves via A records only).

### Receiving mail — ImprovMX setup (chosen approach, BLOCKED on DNS access)

Mailgun inbound Routes require a paid plan, so receiving uses **ImprovMX** (free
forwarding). To set up / reconfigure at Squarespace DNS:

1. In ImprovMX: add `accreditrack.com`, create alias `support` → personal email.
2. In Squarespace DNS: DELETE the Mailgun MX records; ADD two MX records:
   - priority 10 → `mx1.improvmx.com`
   - priority 20 → `mx2.improvmx.com`
3. Leave the SPF TXT and any DKIM records untouched (they power Mailgun sending).
4. If ImprovMX flags SPF, MERGE into the single SPF record (never add a second
   `v=spf1` record): `v=spf1 include:mailgun.org include:spf.improvmx.com ~all`
5. Verify: send a test to `support@accreditrack.com` (should forward to your
   inbox) AND confirm Mailgun sending still works (trigger a notification).

### Analytics (PostHog) — LIVE

Integrated via `posthog-js` and **active in production** (verified: pageviews
flowing). US region. The Project API Key (`phc_...`, public by design) is baked
into `public/runtime-config.js` — NOT just a Railway env var, because Railway
serves the committed runtime-config as-is (setting the env var alone does NOT
work; the value must be in the file). Same pattern as the API URL / Auth0
audience. To change the key: edit `runtime-config.js` and redeploy.

- Config is read from build-time env OR runtime `window.__APP_CONFIG__` (same
  mechanism as the API URL), so it can be toggled without a rebuild.
- Pageviews fire on every SPA route change (`src/App.tsx` `PageviewTracker`), so
  each vertical page (`/for/healthcare`, etc.) is tracked separately — this is
  how you see which vertical converts.
- Conversion events (`src/utils/analytics.ts`): `get_started_clicked`,
  `go_pro_clicked`. Build funnels in PostHog: vertical pageview → Get Started →
  go PRO.

#### Campaign tracking (UTM) for outreach / ads

`captureUtmParams()` (called on load in `main.tsx`) reads UTM params from the
landing URL and registers them as PostHog super-properties, so they ride along
on every event that session (including the conversion events). This is how a
cold-email or ad click gets attributed all the way to a signup.

Link scheme to use in outreach — always point at the vertical page and tag the
source/campaign, e.g. for the childcare cold-email batch:

```
https://accreditrack.com/for/childcare?utm_source=coldemail&utm_medium=email&utm_campaign=childcare-batch1
```

Vary `utm_campaign` per batch/vertical (`childcare-batch1`, `construction-ads`,
etc.) and `utm_source` per channel (`coldemail`, `google`, `linkedin`).

Build this funnel in PostHog to see what converts:
1. `$pageview` where `$current_url` contains `/for/childcare`
2. `get_started_clicked`
3. `go_pro_clicked`

Break down by `utm_campaign` / `utm_source` to compare batches and channels.
Because UTMs are registered as super-properties, they appear as event
properties you can filter/break-down on.
- Note: adding PostHog grew the JS bundle (~568KB → ~850KB). Fine for now; can
  be lazy-loaded later if needed.

### Stripe (LIVE)

- Live product/price: AccrediTrack PRO, $19/month, price ID
  `price_1U9xIwHlRlsQxu8xvEp3hzG3` (backend env `STRIPE_PRODUCT_KEY`).
- Backend env: `STRIPE_SECRET_KEY` (live), `STRIPE_WEB_HOOK_SECRET` (live
  endpoint's signing secret), `STRIPE_PRODUCT_KEY`, `DOMAIN`
  (`https://accreditrack.com`, used for the post-checkout redirect).
- Frontend `VITE_STRIPE_PUBLISHABLE_KEY` is set to live but is NOT actually used
  — checkout is backend-driven via hosted Checkout (`src/lib/stripe.tsx`
  `getStripe()` is dead code).
- Live webhook endpoint points at `.../webhook`. A refund does NOT cancel a
  subscription — cancel the subscription separately in the Stripe dashboard.
- Checkout flow: go PRO button (`Layout.tsx`) → authed POST to
  `/create-checkout-session` → backend returns the Stripe URL as JSON → browser
  redirects to hosted Checkout → on payment, Stripe webhook →
  `FulfillCheckout` → `TurnPro` sets `pro=1`.

### Env var quick reference

Backend (`accredi-track`): `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`
(`https://accredi-track/api`), `STRIPE_SECRET_KEY`, `STRIPE_WEB_HOOK_SECRET`,
`STRIPE_PRODUCT_KEY`, `DOMAIN`, `CORS_ALLOWED_ORIGINS` (code also always allows
accreditrack.com + www), `MAILGUN_API_KEY`, `CRON_API_KEY`, `HOST` (empty in
prod). Frontend (`accredi-track-web`): `VITE_APP_API_URL`, `VITE_AUTH0_AUDIENCE`
(must match backend), `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`,
`VITE_STRIPE_PUBLISHABLE_KEY`.

### Deploy gotchas (learned the hard way)

- Browser cannot reach Railway-internal hostnames (`*.railway.internal`). Any URL
  the browser calls needs the service's PUBLIC URL.
- `public/runtime-config.js` committed defaults ARE the production values (API
  URL + Auth0 audience), so an unset Railway env var degrades to correct rather
  than blank.
- Auth0 audience must be identical in Auth0 (API identifier), frontend
  `VITE_AUTH0_AUDIENCE`, and backend `AUTH0_AUDIENCE`. Empty frontend audience →
  401 "Invalid token"; mismatch → 401 "Invalid audience".

The default local frontend URL is typically:

- `http://localhost:5173`

## Environment Variables

The frontend currently uses these Vite environment variables:

- `VITE_APP_API_URL`
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`
- `VITE_STRIPE_PUBLISHABLE_KEY`

### Example local env

```env
VITE_APP_API_URL=http://localhost:8080
VITE_AUTH0_DOMAIN=thumbsupsolutions.auth0.com
VITE_AUTH0_CLIENT_ID=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_AUTH0_AUDIENCE=https://accredi-track/api
```

Important env notes (these caused real production outages):

- `VITE_AUTH0_AUDIENCE` must be the **custom API identifier** (`https://accredi-track/api`),
  NOT the Auth0 Management API (`.../api/v2/`). If it is empty or wrong, Auth0
  returns an opaque token and the backend rejects every request with 401
  ("Invalid token" / "Invalid audience"). The backend's `AUTH0_AUDIENCE` must
  match this exact value.
- `VITE_APP_API_URL` must be the backend's **public** URL. In production that is
  `https://accredi-track-production.up.railway.app` (Railway-internal hostnames
  are not reachable from the browser). If empty, API calls hit the frontend
  origin and 404.
- In the deployed build these values are read at runtime from
  `public/runtime-config.js` (its committed defaults are the production values),
  so an unset Railway env var degrades to the correct URL/audience rather than
  breaking.

## Auth0 Notes

The frontend uses `Auth0Provider` in `src/main.tsx`.

For local development, Auth0 should allow:

- callback URL for `http://localhost:5173`
- logout URL for `http://localhost:5173`
- web origin for `http://localhost:5173`

Session persistence was configured to reduce unnecessary re-login behavior across refreshes.

## Main Frontend Areas

- `src/main.tsx`: app bootstrap and Auth0 provider
- `src/App.tsx`: route map
- `src/context/UserContext.tsx`: user loading and session-related app state
- `src/components/auth0`: login, logout, and route protection
- `src/components/Dashboard.tsx`: top-level metrics UI
- `src/components/employees`: employee screens
- `src/components/licenses`: license type screens
- `src/components/employee-licenses`: employee license screens

## Useful Scripts

Run dev server:

```powershell
npm run dev
```

Build production bundle:

```powershell
npm run build
```

Lint the frontend:

```powershell
npm run lint
```

Preview production build locally:

```powershell
npm run preview
```

## Current Priorities

1. Stabilize auth and route persistence
2. Verify all CRUD flows against the local backend
3. Improve onboarding and empty states
4. Prepare the app for staging deployment

## Railway Deployment

This frontend can be deployed as a Railway service using the included Dockerfile.

1. Create a Railway service from `benfortenberry/accredi-track-web`.
2. Railway will build using `Dockerfile` and serve `dist` with `serve`.
3. Set variables from `.env.railway.example`.
4. Redeploy after variable updates.

Important:

- `VITE_APP_API_URL` must point to the Railway backend public domain.
- Auth0 callback/logout/web origin settings must include the Railway frontend domain.

## Related Docs

Main roadmap document lives in the backend repo root:

- `../accredi-track/REVIVAL_ROADMAP.md`
- `../accredi-track/AWS_STAGING_DEPLOYMENT.md`

Frontend staging env template:

- `.env.production.example`
