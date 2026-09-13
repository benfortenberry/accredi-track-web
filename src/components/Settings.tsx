import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { httpClient, withAxios } from "../utils/AxiosInstance";
import DeleteModal from "../components/modals/DeleteModal";
import { showToast } from "../utils/Utilities";
import { useAuth0 } from "@auth0/auth0-react";
import { getApiBaseUrl } from "../utils/config";
import { useGoPro } from "../utils/useGoPro";

const Settings = () => {
  const API_BASE_URL = getApiBaseUrl();
  const api = `${API_BASE_URL}/employee-data`;
  const userApi = `${API_BASE_URL}/user`;

  const { logout } = useAuth0();
  const { aUser } = useUser();
  const goPro = useGoPro();

  const isPro = aUser?.pro === 1;

  const getEmployeeData = async () => {
    try {
      const response = await httpClient.get(api, {
        responseType: "blob", // Ensure the response is treated as a binary file
      });

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employee-data.csv"); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the DOM
    } catch (error) {
      console.error("Failed to download employee data:", error);
      showToast("Failed to export data. Please try again.", "error");
    }
  };

  const deleteAccount = async () => {
    const modal = document.getElementById("delete-modal") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    httpClient
      .delete(`${userApi}`)
      .then(() => {
        logout({ logoutParams: { returnTo: window.location.origin } });
        //  window.location.href = "/";
      })
      .catch(() => {
        showToast("Failed to delete account. Please try again.", "error");
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Settings</h2>

      {/* ── Subscription ─────────────────────────────────────────── */}
      <section className="rounded-box border border-base-content/10 bg-base-200 p-5 mb-4">
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3 className="font-semibold">Subscription</h3>
          <span
            className={`badge ${isPro ? "badge-primary" : "badge-ghost"}`}
          >
            {isPro ? "PRO" : "Free"}
          </span>
        </div>
        <p className="text-sm text-base-content/60 mb-4">
          {isPro
            ? "You're on PRO: unlimited employees, license types, and credentials, plus early expiration warnings."
            : "You're on the free plan. Upgrade to PRO for unlimited records and early “expiring soon” warnings."}
        </p>
        {isPro ? (
          <a
            href="https://billing.stripe.com/p/login/3cs16Q1iyayi8JqdQQ"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            Manage subscription
          </a>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={goPro}>
            Upgrade to PRO
          </button>
        )}
      </section>

      {/* ── Your data ────────────────────────────────────────────── */}
      <section className="rounded-box border border-base-content/10 bg-base-200 p-5 mb-4">
        <h3 className="font-semibold mb-1">Your data</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Export your employee and license data, or manage the license types
          you track.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={getEmployeeData}
            className="btn btn-outline btn-sm"
          >
            Export data (CSV)
          </button>
          <Link to="/license-types" className="btn btn-outline btn-sm">
            Edit license types
          </Link>
        </div>
      </section>

      {/* ── Danger zone ──────────────────────────────────────────── */}
      <section className="rounded-box border border-error/30 bg-error/5 p-5">
        <h3 className="font-semibold text-error mb-1">Danger zone</h3>
        <p className="text-sm text-base-content/70 mb-4">
          Deleting your account removes your data and cancels any active
          subscription. Export your data first; this can't be undone.
        </p>
        <button
          type="button"
          onClick={deleteAccount}
          className="btn btn-error btn-outline btn-sm"
        >
          Delete account
        </button>
      </section>

      <DeleteModal
        delete={handleDelete}
        label="account"
        text="Are you sure you wish to delete your account? All employee licenses will be deleted as well. Make sure to export your data before proceeding."
      />
    </div>
  );
};

export default withAxios(Settings);
