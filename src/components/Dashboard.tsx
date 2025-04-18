import { useEffect, useState } from "react";

import config from "../config";
import { httpClient, withAxios } from "../utils/AxiosInstance";
import LicenseTypeChart from "./charts/LicenseTypeChart";

function Dashboard() {
  const api = `${config.apiBaseUrl}/metrics`;

  interface Metrics {
    totalEmployees: number;
    expiredCount: number;
    expiringSoon: number;
    complianceRate: number;
    licenseAvg: number;
    notificationCount: number;
  }

  interface LicenseCount {
    count: number;
    licenseName: string;
  }

  interface LicenseChartData {
    labels: Array<string>;
    datasets: Array<object>;
  }



  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [, setLicenseCounts] = useState<LicenseCount[]>([]);
  const [licenseChartData, setLicenseChartData] = useState<LicenseChartData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics();
    getLicenseCounts();
  }, []);

  const getMetrics = () => {
    httpClient
      .get(api)
      .then((res) => {
        setMetrics(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch dashboard");
      });
  };

  const getLicenseCounts = () => {
    httpClient
      .get(api + "/license-chart-data")
      .then((res) => {

        setLicenseCounts(() => {
          const newCount =res.data
          const labels = newCount.map((row: { licenseName: any; }) => row.licenseName)

         const datasets = [
            {
              label: 'Valid',
              data: newCount.map((row: { count: any; }) => row.count),
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
              label: 'Expired',
              data: newCount.map((row: { count: any; }) => row.count),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
          ]

          

          setLicenseChartData({labels, datasets})
          return newCount;
        });



     
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch License Chart Data");
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
        <LicenseTypeChart data={licenseChartData} />
        <div className="grid sm:grid-cols-3 xs:grid-cols-2  gap-4">
          <div className="stat place-items-center">
            <div className="stat-title">Active Employees</div>
            {/* {metrics?.totalEmployees} */}
            <div className="stat-value text-white">
              {" "}
              {metrics?.totalEmployees}
            </div>
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
            <div className="stat-value text-white">
              {metrics?.complianceRate}%
            </div>

            <div className="stat-desc text-error">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Avg License Per Employees</div>
            <div className="stat-value text-white">{metrics?.licenseAvg}</div>
            <div className="stat-desc text-white">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Notifications Sent</div>
            <div className="stat-value text-white">
              {metrics?.notificationCount}
            </div>
            <div className="stat-desc text-white">This Month</div>
          </div>
        </div>
      </div>
    );
  }
}
export default withAxios(Dashboard);
