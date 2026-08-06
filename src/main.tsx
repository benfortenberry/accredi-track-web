// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "./context/UserContext";
import { getAuth0Audience, getAuth0ClientId, getAuth0Domain } from "./utils/config";

const auth0Domain = getAuth0Domain();
const auth0ClientId = getAuth0ClientId();
const auth0Audience = getAuth0Audience();

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    cacheLocation="localstorage"
    useRefreshTokens={true}
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: 'openid email profile',
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
