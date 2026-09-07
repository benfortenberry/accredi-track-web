import { useEffect, useState } from "react";
import { httpClient, withAxios } from "../utils/AxiosInstance";
import { getApiBaseUrl } from "../utils/config";
import { formatDate } from "../utils/Utilities";
import ErrorState from "./ErrorState";
import { useUser } from "../context/UserContext";

// Notifications is the audit-log view for expiration reminder emails. Each row
// is one credential a reminder was sent about, newest first. This is the detail
// behind the dashboard's "Notifications Sent" count.
function Notifications() {
  const API_BASE_URL = getApiBaseUrl();
  const api = `${API_BASE_URL}/notifications`;

  const { aUser } = useUser();

  interface NotificationLog {
    id: number;
    employeeId: number;
    licenseId: number;
    firstName: string;
    lastName: string;
    licenseName: string;
    recipientEmail: string;
    expDate: string;
    createdAt: string;
  }

  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    setIsLoading(true);
    setError(null);
    httpClient
      .get(api)
      .then((res) => {
        setNotifications(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch notifications");
      });
  };

  const employeeName = (n: NotificationLog) => {
    const name = `${n.firstName} ${n.lastName}`.trim();
    return name || "(deleted employee)";
  };

  if (error) {
    return <ErrorState detail={error} onRetry={getNotifications} />;
  } else if (isLoading || !aUser) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1 ml-2">Notifications sent</h2>
      <p className="text-sm text-base-content/60 mb-4 ml-2">
        A record of the expiration reminder emails AccrediTrack has sent, newest
        first.
      </p>

      {notifications.length > 0 ? (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Sent</th>
                <th>Employee</th>
                <th>License Type</th>
                <th>Expiration</th>
                <th>Sent To</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id}>
                  <td>{formatDate(n.createdAt)}</td>
                  <td>{employeeName(n)}</td>
                  <td>{n.licenseName || "(deleted license type)"}</td>
                  <td>{n.expDate ? formatDate(n.expDate) : "—"}</td>
                  <td>{n.recipientEmail || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-6 rounded-box border border-base-content/10 bg-base-100 p-8">
          <h3 className="text-lg font-bold">No notifications yet</h3>
          <p className="mt-2 text-sm opacity-80 max-w-md mx-auto">
            When a credential expires, AccrediTrack emails you a reminder and
            records it here. Reminders are a PRO feature.
          </p>
        </div>
      )}
    </div>
  );
}

export default withAxios(Notifications);
