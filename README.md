# AccrediTrack Web

AccrediTrack Web is the frontend for the AccrediTrack credential and license tracking application.

It is built with:

- React
- TypeScript
- Vite
- Auth0 for authentication
- Stripe for billing hooks
- Tailwind CSS and daisyUI for UI styling

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

- Node.js installed locally
- Backend API running locally

### Install and run

```powershell
npm install
npm run dev
```

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
VITE_AUTH0_AUDIENCE=https://thumbsupsolutions.auth0.com/api/v2/
```

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
