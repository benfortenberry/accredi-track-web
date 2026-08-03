// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "./context/UserContext";


createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="thumbsupsolutions.auth0.com"
    clientId="RwAsIDcSImAUQsefyBpCH8FWvxe4wSLL"
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
