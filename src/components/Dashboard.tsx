import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { httpClient, withAxios } from "../utils/AxiosInstance";
import LicenseTypeChart from "./charts/LicenseTypeChart";
import ExpiringSoonChart from "./charts/ExpiringSoonChart";
import ErrorState from "./ErrorState";
import { getApiBaseUrl } from "../utils/config";

function Dashboard() {
  const API_BASE_URL = getApiBaseUrl();

  const api = `${API_BASE_URL}/metrics`;

  interface Metrics {
    totalEmployees: number;
    expiredCount: number;
    expiringSoon: number;
    complianceRate: number;
    licenseAvg: number;
    notificationCount: number;
    totalEmployeeLicenses: number;
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
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics();
    getLicenseCounts();
    getExpiringSoon();
  }, []);

  const getMetrics = async () => {
    setError(null);
    await httpClient
      .get(api)
      .then((res) => {
        setMetrics(res.data);
        setAssignmentCount(res.data?.totalEmployeeLicenses ?? 0);
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
        // Charts are supplementary; a failure here should not blank the whole
        // dashboard. Leave the chart unrendered and keep the core metrics.
        console.error("Failed to fetch expired license chart data");
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
              backgroundColor: "rgba(234, 88, 12, 0.85)", // burnt orange
            });
          }

          if (expiredCount && expiredCount.length) {
            labels = expiredCount.map((row: { licenseName: unknown }) =>
              String(row.licenseName)
            );

            datasets.push({
              label: "Expired",
              data: expiredCount.map((row: { count: unknown }) => row.count),
              backgroundColor: "rgba(180, 60, 60, 0.85)", // muted red
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
        console.error("Failed to fetch license chart data");
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
              label: "Expiring",
              data: expiringSoonCounts.map((row: { count: unknown }) => row.count),
              backgroundColor: "rgba(234, 88, 12, 0.2)",
              borderColor: "rgba(234, 88, 12, 0.9)",
              borderWidth: 2,
              tension: 0.3,
            },
          ];

          setLExpiringSoonChartData({ labels, datasets });
          return expiringSoonCounts;
        });

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        console.error("Failed to fetch expiring-soon chart data");
      });

    setIsLoading(false);
  };

  if (error) {
    return <ErrorState detail={error} onRetry={getMetrics} />;
  } else if (isLoading) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  } else {
    return (
      <div>
        {(() => {
          const hasEmployees = (metrics?.totalEmployees ?? 0) > 0;
          const hasAssignments = assignmentCount > 0;
          // License types are created inline while adding a credential, so the
          // checklist is complete once there's an employee with a credential.
          const allDone = hasEmployees && hasAssignments;
          if (allDone) return null;

          const step = (done: boolean, label: string) => (
            <li className="flex items-center gap-2">
              <span
                className={`badge ${done ? "badge-success" : "badge-ghost"}`}
              >
                {done ? "\u2713" : ""}
              </span>
              <span className={done ? "line-through opacity-60" : ""}>
                {label}
              </span>
            </li>
          );

          // Two-step flow that matches the app: add an employee, then add a
          // credential (the license type is created inline during that step, so
          // there's no separate "create a license type first" prerequisite).
          return (
            <div className="mb-6 rounded-box border border-base-content/10 bg-base-100 p-4">
              <h3 className="text-lg font-semibold">Getting started</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {step(hasEmployees, "Add an employee.")}
                {step(
                  hasAssignments,
                  "Add a credential — pick or create a license type and set the dates."
                )}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {!hasEmployees && (
                  <Link to="/employees" className="btn btn-sm btn-primary">
                    Add an employee
                  </Link>
                )}
                {hasEmployees && !hasAssignments && (
                  <Link to="/employees" className="btn btn-sm btn-primary">
                    Add a credential
                  </Link>
                )}
              </div>
            </div>
          );
        })()}

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="px-2 sm:px-6 pt-5 text-center h-64 sm:h-72">
            {licenseChartData && <LicenseTypeChart data={licenseChartData} />}
          </div>
          <div className="px-2 sm:px-6 pt-5 text-center h-64 sm:h-72">
            {licenseChartData && expiringSoonChartData && (
              <ExpiringSoonChart data={expiringSoonChartData} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="stat place-items-center">
            <div className="stat-title">Active Employees</div>
            <div className="stat-value">{metrics?.totalEmployees ?? 0}</div>
            <div className="stat-desc ">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Expiring Soon</div>
            <div className="stat-value ">{metrics?.expiringSoon ?? 0}</div>
            <div className="stat-desc ">Next 30 Days</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Expired Licenses</div>
            <div className="stat-value ">{metrics?.expiredCount ?? 0}</div>
            <div className="stat-desc ">&nbsp;</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="stat place-items-center">
            <div className="stat-title">Compliance Rate</div>
            <div className="stat-value ">
              {metrics?.complianceRate != null
                ? Math.round(Number(metrics.complianceRate))
                : 0}
              %
            </div>

            <div className="stat-desc text-error">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Avg License Per Employees</div>
            <div className="stat-value ">
              {metrics?.licenseAvg != null
                ? Number(metrics.licenseAvg).toFixed(1)
                : "0"}
            </div>
            <div className="stat-desc ">&nbsp;</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Notifications Sent</div>
            <div className="stat-value ">{metrics?.notificationCount ?? 0}</div>
            <div className="stat-desc ">Total Sent</div>
          </div>
        </div>
      </div>
    );
  }
}
export default withAxios(Dashboard);
