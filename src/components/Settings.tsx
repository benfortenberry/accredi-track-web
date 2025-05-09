import { useUser } from "../context/UserContext";
import { httpClient, withAxios } from "../utils/AxiosInstance";
import DeleteModal from "../components/modals/DeleteModal";
import { showToast } from "../utils/Utilities";
import { useAuth0 } from "@auth0/auth0-react";

const Settings = () => {
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const api = `${API_BASE_URL}/employee-data`;
  const userApi = `${API_BASE_URL}/user`;

  const { logout } = useAuth0();
  const { aUser } = useUser();

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
    <div>
      <h2 className="text-xl font-bold mb-4 ml-2">Settings</h2>

      <a href="/license-types" className="btn mx-2 btn-default">
        Edit License Types
      </a>

      <a onClick={getEmployeeData} className="btn mx-2 btn-default">
        Export Data
      </a>

      <a onClick={deleteAccount} className="btn mx-2 btn-default">
        Delete Account
      </a>

      {aUser && aUser.pro == 1 && (
        <a
          href="https://billing.stripe.com/p/login/3cs16Q1iyayi8JqdQQ"
          target="_blank"
          className="btn mx-2 btn-default"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          Manage PRO Subscription
        </a>
      )}

      <DeleteModal
        delete={handleDelete}
        label="account"
        text="Are you sure you wish to delete your account? All employee licenses will be deleted as well. Make sure to export your data before proceeding."
      />
    </div>
  );
};

export default withAxios(Settings);
