import { useUser } from "../context/UserContext";
import { httpClient, withAxios } from "../utils/AxiosInstance";

const Settings = () => {
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const api = `${API_BASE_URL}/employee-data`;

  const { user } = useUser();


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


  return (
    <div>
      <h2 className="text-xl font-bold mb-4 ml-2">Settings</h2>

      <a href="/license-types" className="btn mx-2 btn-default">
        Edit License Types
      </a>

      <a onClick={getEmployeeData} className="btn mx-2 btn-default">
        Export Data
      </a>


      {user && user.pro && (
        <a
          href="https://billing.stripe.com/p/login/3cs16Q1iyayi8JqdQQ"
          target="_blank"
          className="btn mx-2 btn-default"
        >
          Manage PRO Subscription
        </a>
      )}
    </div>
  );
};

export default withAxios(Settings);
