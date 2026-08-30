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
