import { useEffect, useState } from "react";

type ProbeStatus = "idle" | "loading" | "ok" | "error";

const HealthCheck = () => {
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
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
      const response = await fetch(`${apiBaseUrl}/health`, {
        method: "GET",
      });

      const bodyText = await response.text();
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
