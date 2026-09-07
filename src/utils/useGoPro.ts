import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";
import { httpClient } from "./AxiosInstance";
import { showToast } from "./Utilities";
import { getApiBaseUrl } from "./config";
import { track } from "./analytics";

// useGoPro centralizes the Stripe checkout kickoff so every "upgrade" affordance
// (nav button, limit CTAs) behaves identically. The call must go through
// httpClient so the Auth0 Bearer token is attached; the backend returns the
// checkout URL as JSON (not a redirect) and we navigate the browser to it.
export function useGoPro() {
  const API_BASE_URL = getApiBaseUrl();
  const { user } = useAuth0();
  const { aUser } = useUser();

  const email = user?.email || aUser?.email || "";

  const goPro = async () => {
    track("go_pro_clicked");
    try {
      const form = new URLSearchParams();
      form.append("email", email);
      const res = await httpClient.post(
        `${API_BASE_URL}/create-checkout-session`,
        form
      );
      const url = res.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        showToast("Could not start checkout. Please try again.", "error");
      }
    } catch (err: any) {
      console.error("Error starting checkout:", err);
      showToast(
        err?.response?.data?.error ||
          "Could not start checkout. Please try again.",
        "error"
      );
    }
  };

  return goPro;
}
