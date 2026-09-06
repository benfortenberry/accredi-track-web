// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "./context/UserContext";
import {
  getApiBaseUrl,
  getAuth0Audience,
  getAuth0ClientId,
  getAuth0Domain,
} from "./utils/config";
import { initAnalytics, captureUtmParams } from "./utils/analytics";

// Fail loud on misconfiguration: an empty API base URL means every API call
// hits the frontend host and 404s (spinners never resolve). Surface it clearly
// instead of leaving developers to decode cryptic 404s.
if (!getApiBaseUrl()) {
  console.error(
    "[config] VITE_APP_API_URL is not set. API requests will hit the frontend " +
      "origin and fail with 404. Set it as a build-time env var or in " +
      "public/runtime-config.js (window.__APP_CONFIG__.VITE_APP_API_URL)."
  );
}

// No-op unless VITE_POSTHOG_KEY is configured.
initAnalytics();
// Attach any UTM params from the landing URL so campaign attribution flows
// through to conversion events (cold-email / ad tracking).
captureUtmParams();

const auth0Domain = getAuth0Domain();
const auth0ClientId = getAuth0ClientId();
const auth0Audience = getAuth0Audience();

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    cacheLocation="localstorage"
    useRefreshTokens={true}
    useRefreshTokensFallback={true}
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: "openid email profile offline_access",
      ...(auth0Audience ? { audience: auth0Audience } : {}),
    }}
  >
    {/* <StrictMode> */}
    <UserProvider>
      <App />
      </UserProvider>
    {/* </StrictMode> */}
  </Auth0Provider>
);
