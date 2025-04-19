import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="thumbsupsolutions.auth0.com"
    clientId="RwAsIDcSImAUQsefyBpCH8FWvxe4wSLL"
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: 'openid email profile',
      audience: "https://accredi-track/api", // Ensure this matches your API audience
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>
);
