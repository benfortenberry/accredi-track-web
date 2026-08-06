import { useEffect, useState } from "react";
import { getApiBaseUrl } from "../utils/config";

type ProbeStatus = "idle" | "loading" | "ok" | "error";

const HealthCheck = () => {
  const apiBaseUrl = getApiBaseUrl();
  const [status, setStatus] = useState<ProbeStatus>("idle");
  const [message, setMessage] = useState("");

  const runProbe = async () => {
    if (!apiBaseUrl) {
      setStatus("error");
      setMessage("VITE_APP_API_URL is missing");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const healthUrl = `${apiBaseUrl}/health`;
      const response = await fetch(healthUrl, {
        method: "GET",
      });

      const bodyText = await response.text();
      const contentType = response.headers.get("content-type") || "";
      const looksLikeHtml =
        contentType.includes("text/html") ||
        bodyText.toLowerCase().includes("<!doctype html");

      if (looksLikeHtml) {
        setStatus("error");
        setMessage(
          `Received HTML from ${healthUrl}. API URL is likely pointing to the frontend domain instead of backend.`
        );
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setMessage(`HTTP ${response.status}: ${bodyText}`);
        return;
      }

      setStatus("ok");
      setMessage(bodyText || "connected");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Network error");
    }
  };

  useEffect(() => {
    runProbe();
  }, []);

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-bold">Frontend API Connection Check</h1>
      <p>
        API URL: <span className="font-mono">{apiBaseUrl || "(not set)"}</span>
      </p>

      {status === "loading" && <p>Checking backend health...</p>}
      {status === "ok" && <p className="text-success">Connected: {message}</p>}
      {status === "error" && <p className="text-error">Failed: {message}</p>}

      <button type="button" className="btn btn-primary btn-sm" onClick={runProbe}>
        Re-test Connection
      </button>
    </div>
  );
};

export default HealthCheck;
