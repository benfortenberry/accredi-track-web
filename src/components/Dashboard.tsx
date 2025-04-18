import { useEffect, useState } from "react";

import { httpClient, withAxios } from "../utils/AxiosInstance";
import LicenseTypeChart from "./charts/LicenseTypeChart";
import ExpiringSoonChart from "./charts/ExpiringSoonChart";

function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  const api = `${API_BASE_URL}/metrics`;

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

  interface ExpiringSoon {
    count: number;
    month: string;
  }

  interface ChartData {
    labels: Array<string>;
    datasets: Array<object>;
  }

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [, setLicenseCounts] = useState<LicenseCount[]>([]);
  const [, setExpiringSoonLCounts] = useState<ExpiringSoon[]>([]);
  const [licenseChartData, setLicenseChartData] = useState<ChartData>();
  const [expiringSoonChartData, setLExpiringSoonChartData] = useState<ChartData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics();
    getLicenseCounts();
    getExpiringSoon()
  }, []);

  const getMetrics = async () => {
    await httpClient
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

  const getLicenseCounts = async () => {
    let expiredCount: LicenseCount[];

    await httpClient
      .get(api + "/license-chart-data-expired")
      .then((res) => {
        expiredCount = res.data;
      })
      .catch(() => {
        setError("Failed to fetch License Chart Data");
      });

    await httpClient
      .get(api + "/license-chart-data")
      .then((res) => {
        // setLicenseCounts(res.data);
        setLicenseCounts(() => {
          const licenseCounts = res.data;
          const labels = licenseCounts.map(
            (row: { licenseName: any }) => row.licenseName
          );

          const datasets = [
            {
              label: "Valid",
              data: licenseCounts.map((row: { count: any }) => row.count),
              backgroundColor: "rgb(59, 187, 247)",
            },
            {
              label: "Expired",
              data: expiredCount.map((row: { count: any }) => row.count),
              backgroundColor: "rgb(251, 112, 133)",
            },
          ];

          setLicenseChartData({ labels, datasets });
          return licenseCounts;
        });

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch License Chart Data");
      });

    setIsLoading(false);
  };

  const getExpiringSoon = async() => {
    await httpClient
    .get(api + "/license-chart-data-expiring-soon")
    .then((res) => {
      // setLicenseCounts(res.data);
      setExpiringSoonLCounts(() => {
        const expiringSoonCounts = res.data;
        const labels = expiringSoonCounts.map(
          (row: { month: any }) => row.month
        );

        const datasets = [
          {
            label: "Valid",
            data: expiringSoonCounts.map((row: { count: any }) => row.count),
            backgroundColor: "rgb(59, 187, 247)",
          },
          
        ];

        setLExpiringSoonChartData({ labels, datasets });
        return expiringSoonCounts;
      });

      setIsLoading(false);
    })
    .catch(() => {
      setIsLoading(false);
      setError("Failed to fetch License Chart Data");
    });

  setIsLoading(false);
  }

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
        <div className="grid overflow-x-auto lg:grid-cols-2 gap-4">
          <div className="pr-20 pl-20   pt-5 text-center  h-75">
            {licenseChartData && <LicenseTypeChart data={licenseChartData} />}
          </div>
          <div className="col-span-1 pr-20 pl-20 text-center  h-75  pt-5 ">
          {expiringSoonChartData &&  <ExpiringSoonChart data={expiringSoonChartData} /> }
          </div>
        </div>

        <div className="grid sm:grid-cols-3 xs:grid-cols-2  gap-4">
          <div className="stat place-items-center">
            <div className="stat-title">Active Employees</div>
            {/* {metrics?.totalEmployees} */}
            <div className="stat-value">{metrics?.totalEmployees}</div>
            <div className="stat-desc ">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Expiring Soon</div>
            <div className="stat-value ">{metrics?.expiringSoon}</div>
            <div className="stat-desc ">Next 30 Days</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Expired Licenses</div>
            <div className="stat-value ">{metrics?.expiredCount}</div>
            <div className="stat-desc ">&nbsp;</div>
          </div>
        </div>

        <div className="grid  sm:grid-cols-3 xs:grid-cols-2 gap-4">
          <div className="stat place-items-center">
            <div className="stat-title">Compliance Rate</div>
            <div className="stat-value ">{metrics?.complianceRate}%</div>

            <div className="stat-desc text-error">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Avg License Per Employees</div>
            <div className="stat-value ">{metrics?.licenseAvg}</div>
            <div className="stat-desc ">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Notifications Sent</div>
            <div className="stat-value ">{metrics?.notificationCount}</div>
            <div className="stat-desc ">This Month</div>
          </div>
        </div>
      </div>
    );
  }
}
export default withAxios(Dashboard);
