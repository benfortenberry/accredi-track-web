// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "./context/UserContext";

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN || "thumbsupsolutions.auth0.com";
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "RwAsIDcSImAUQsefyBpCH8FWvxe4wSLL";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    cacheLocation="localstorage"
    useRefreshTokens={true}
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: 'openid email profile',
      audience:  import.meta.env.VITE_AUTH0_AUDIENCE, 
    }}
  >
    {/* <StrictMode> */}
    <UserProvider>
      <App />
      </UserProvider>
    {/* </StrictMode> */}
  </Auth0Provider>
);
