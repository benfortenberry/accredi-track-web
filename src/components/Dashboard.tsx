import { useEffect, useState } from "react";

import config from "../config";
import { httpClient, withAxios } from "../utils/AxiosInstance";

function Dashboard() {
  const api = `${config.apiBaseUrl}/metrics`;

  interface Metrics {
    totalEmployees: number;
    expiredCount: number;
    expiringSoon: number
  }

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics();
  }, []);

  const getMetrics = () => {
    setIsLoading(true);
    httpClient
      .get(api)
      .then((res) => {
        setMetrics(res.data);
        console.log(metrics)
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch employees");
      });
  };

  if (error) {
    return <h1 className="text-xl font-bold mb-4">{error}</h1>;
  } else if (isLoading) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  } else {
    return (
      <div>
        <div className="grid sm:grid-cols-3 xs:grid-cols-2  gap-4">
          <div className="stat place-items-center">
            <div className="stat-title">Active Employees</div>
            {/* {metrics?.totalEmployees} */}
            <div className="stat-value text-white"> {metrics?.totalEmployees}</div>
            <div className="stat-desc text-white">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Expiring Soon</div>
            <div className="stat-value text-white">{metrics?.expiringSoon}</div>
            <div className="stat-desc text-white">Next 30 Days</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Expired Licenses</div>
            <div className="stat-value text-white">{metrics?.expiredCount}</div>
            <div className="stat-desc text-white">&nbsp;</div>
          </div>
        </div>

        <div className="grid  sm:grid-cols-3 xs:grid-cols-2 gap-4">
          <div className="stat place-items-center">
            <div className="stat-title">Compliance Rate</div>
            {/* <div className="skeleton h-15 mt-3 w-full"></div> */}
            <div className="stat-value text-white">95%</div>

            <div className="stat-desc text-error">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Avg License Per Employees</div>
            <div className="stat-value text-white">3.04</div>
            <div className="stat-desc text-white">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Notifications Sent</div>
            <div className="stat-value text-white">40</div>
            <div className="stat-desc text-white">This Month</div>
          </div>
        </div>
      </div>
    );
  }
}
export default withAxios(Dashboard);
