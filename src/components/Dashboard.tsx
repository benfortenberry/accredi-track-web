import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { httpClient, withAxios } from "../utils/AxiosInstance";
import LicenseTypeChart from "./charts/LicenseTypeChart";
import ExpiringSoonChart from "./charts/ExpiringSoonChart";
import ErrorState from "./ErrorState";
import { getApiBaseUrl } from "../utils/config";
import { themeColor, themeColorAlpha } from "../utils/themeColors";

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

          // Build ONE shared set of category labels (every license type that
          // appears in either the valid or the expired data), then align each
          // dataset to that order. Previously each dataset set its own labels
          // and the second overwrote the first, so the x-axis showed only the
          // expired types and the two series didn't line up.
          const validByName = new Map(
            licenseCounts.map((r) => [String(r.licenseName), Number(r.count)])
          );
          const expiredByName = new Map(
            (expiredCount || []).map((r) => [
              String(r.licenseName),
              Number(r.count),
            ])
          );

          const labels = Array.from(
            new Set([...validByName.keys(), ...expiredByName.keys()])
          );

          const datasets = [];
          if (labels.length) {
            datasets.push({
              label: "Valid",
              data: labels.map((name) => validByName.get(name) ?? 0),
              backgroundColor: themeColor("success"), // green = valid, matches the "Active" status
              borderRadius: 2,
              borderSkipped: false,
              maxBarThickness: 40,
            });
            datasets.push({
              label: "Expired",
              data: labels.map((name) => expiredByName.get(name) ?? 0),
              backgroundColor: themeColor("error"), // matches the "Expired" status
              borderRadius: 2,
              borderSkipped: false,
              maxBarThickness: 40,
            });
          }

          setLicenseChartData({ labels, datasets });
          return licenseCounts;
        });
      })
      .catch(() => {
        // Charts are supplementary and do NOT control the page spinner; only
        // getMetrics does. This prevents a flash where isLoading flips false
        // before metrics arrives, briefly rendering the "Getting started"
        // checklist for a user who actually has data.
        console.error("Failed to fetch license chart data");
      });
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
              backgroundColor: themeColorAlpha("warning", 0.2), // matches Expiring Soon tile
              borderColor: themeColorAlpha("warning", 0.9),
              borderWidth: 2,
              tension: 0.3,
            },
          ];

          setLExpiringSoonChartData({ labels, datasets });
          return expiringSoonCounts;
        });
      })
      .catch(() => {
        console.error("Failed to fetch expiring-soon chart data");
      });
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
          <div className="min-w-0 rounded-box border border-base-content/10 bg-base-100 p-4 h-64 sm:h-72 flex justify-center">
            <div className="relative w-full max-w-xl min-w-0 overflow-hidden">
              {licenseChartData && <LicenseTypeChart data={licenseChartData} />}
            </div>
          </div>
          <div className="min-w-0 rounded-box border border-base-content/10 bg-base-100 p-4 h-64 sm:h-72 flex justify-center">
            <div className="relative w-full max-w-xl min-w-0 overflow-hidden">
              {licenseChartData && expiringSoonChartData && (
                <ExpiringSoonChart data={expiringSoonChartData} />
              )}
            </div>
          </div>
        </div>

        {/* Metric tiles. Each is a bordered card (matching the tables/lists
            elsewhere in the app) so they read as intentional rather than
            floating text. Plain markup (not daisyUI `stat`) to avoid the dashed
            divider borders. The two risk metrics (expiring / expired) carry a
            warning/error color on the number so the eye lands on risk first. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
          <Link
            to="/employees"
            className="flex flex-col items-center justify-center gap-1 p-5 rounded-box border border-base-content/10 bg-base-100 hover:bg-base-200 hover:border-base-content/20 transition-colors"
          >
            <div className="text-sm text-base-content/60">Active Employees</div>
            <div className="text-3xl font-bold">{metrics?.totalEmployees ?? 0}</div>
            <div className="text-xs link link-hover">View team</div>
          </Link>

          <Link
            to="/credentials?status=expiring"
            className="flex flex-col items-center justify-center gap-1 p-5 rounded-box border border-base-content/10 bg-base-100 hover:bg-base-200 hover:border-base-content/20 transition-colors"
          >
            <div className="text-sm text-base-content/60">Expiring Soon</div>
            <div
              className={`text-3xl font-bold ${
                (metrics?.expiringSoon ?? 0) > 0 ? "text-warning" : ""
              }`}
            >
              {metrics?.expiringSoon ?? 0}
            </div>
            <div className="text-xs link link-hover">Next 30 days</div>
          </Link>

          <Link
            to="/credentials?status=expired"
            className="flex flex-col items-center justify-center gap-1 p-5 rounded-box border border-base-content/10 bg-base-100 hover:bg-base-200 hover:border-base-content/20 transition-colors"
          >
            <div className="text-sm text-base-content/60">Expired Licenses</div>
            <div
              className={`text-3xl font-bold ${
                (metrics?.expiredCount ?? 0) > 0 ? "text-error" : ""
              }`}
            >
              {metrics?.expiredCount ?? 0}
            </div>
            <div className="text-xs link link-hover">View all</div>
          </Link>

          <Link
            to="/credentials"
            className="flex flex-col items-center justify-center gap-1 p-5 rounded-box border border-base-content/10 bg-base-100 hover:bg-base-200 hover:border-base-content/20 transition-colors"
          >
            <div className="text-sm text-base-content/60">Compliance Rate</div>
            <div className="text-3xl font-bold">
              {metrics?.complianceRate != null
                ? Math.round(Number(metrics.complianceRate))
                : 0}
              %
            </div>
            <div className="text-xs link link-hover">View credentials</div>
          </Link>

          <Link
            to="/credentials"
            className="flex flex-col items-center justify-center gap-1 p-5 rounded-box border border-base-content/10 bg-base-100 hover:bg-base-200 hover:border-base-content/20 transition-colors"
          >
            <div className="text-sm text-base-content/60">Avg Licenses Per Employee</div>
            <div className="text-3xl font-bold">
              {metrics?.licenseAvg != null
                ? Number(metrics.licenseAvg).toFixed(1)
                : "0"}
            </div>
            <div className="text-xs link link-hover">View credentials</div>
          </Link>

          <Link
            to="/notifications"
            className="flex flex-col items-center justify-center gap-1 p-5 rounded-box border border-base-content/10 bg-base-100 hover:bg-base-200 hover:border-base-content/20 transition-colors"
          >
            <div className="text-sm text-base-content/60">Notifications Sent</div>
            <div className="text-3xl font-bold">{metrics?.notificationCount ?? 0}</div>
            <div className="text-xs link link-hover">View log</div>
          </Link>
        </div>
      </div>
    );
  }
}
export default withAxios(Dashboard);
