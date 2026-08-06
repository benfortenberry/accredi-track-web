import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  // const [noData, setNoData] = useState(false);
  const [expiringSoonChartData, setLExpiringSoonChartData] =
    useState<ChartData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics();
    getLicenseCounts();
    getExpiringSoon();
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
    let expiredCount: LicenseCount[] = [];

    await httpClient
      .get(api + "/license-chart-data-expired")
      .then((res) => {
        expiredCount = Array.isArray(res.data) ? res.data : [];
      })
      .catch(() => {
        setError("Failed to fetch License Chart Data");
      });

    await httpClient
      .get(api + "/license-chart-data")
      .then((res) => {
        // setLicenseCounts(res.data);
        //if (res && res.data && res.data.length) {
        setLicenseCounts(() => {
          const licenseCounts: LicenseCount[] = Array.isArray(res.data)
            ? res.data
            : [];

          let labels: string[] = [];
          const datasets = [];

          if (licenseCounts.length) {
            labels = licenseCounts.map((row: { licenseName: unknown }) =>
              String(row.licenseName)
            );

            datasets.push({
              label: "Valid",
              data: licenseCounts.map((row: { count: unknown }) => row.count),
              backgroundColor: "rgb(59, 187, 247)",
            });
          }

          if (expiredCount && expiredCount.length) {
            labels = expiredCount.map((row: { licenseName: unknown }) =>
              String(row.licenseName)
            );

            datasets.push({
              label: "Expired",
              data: expiredCount.map((row: { count: unknown }) => row.count),
              backgroundColor: "rgb(251, 112, 133)",
            });
          }

          setLicenseChartData({ labels, datasets });
          return licenseCounts;
        });
        // }
        // else
        // {
        //   setNoData(true)
        // }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch License Chart Data");
      });

    setIsLoading(false);
  };

  const getExpiringSoon = async () => {
    await httpClient
      .get(api + "/license-chart-data-expiring-soon")
      .then((res) => {
        // setLicenseCounts(res.data);
        setExpiringSoonLCounts(() => {
          const expiringSoonCounts: ExpiringSoon[] = Array.isArray(res.data)
            ? res.data
            : [];
          const labels: string[] = expiringSoonCounts.map(
            (row: { month: unknown }) => String(row.month)
          );

          const datasets = [
            {
              label: "Valid",
              data: expiringSoonCounts.map((row: { count: unknown }) => row.count),
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
        <div className="mb-6 rounded-box border border-base-content/10 bg-base-100 p-4">
          <h3 className="text-lg font-semibold">Getting started</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="badge badge-success">1</span>
              <span>Add an employee and assign their first license.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="badge badge-success">2</span>
              <span>Create a license type in the License Types view.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="badge badge-success">3</span>
              <span>Use the dashboard to track expiring and expired credentials.</span>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/employees" className="btn btn-sm btn-primary">
              Add employee
            </Link>
            <Link to="/license-types" className="btn btn-sm btn-outline">
              Add license type
            </Link>
          </div>
        </div>

        <div className="grid overflow-x-auto lg:grid-cols-2 gap-4">
          {/* {noData && (
            <h1 className="text-xl font-bold mb-4">
              Metrics will be active when you add your first license.
            </h1>
          )} */}

          <div className="pr-20 pl-20   pt-5 text-center  h-75">
            {licenseChartData && <LicenseTypeChart data={licenseChartData} />}
          </div>
          <div className="col-span-1 pr-20 pl-20 text-center  h-75  pt-5 ">
            {licenseChartData && expiringSoonChartData && (
              <ExpiringSoonChart data={expiringSoonChartData} />
            )}
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
