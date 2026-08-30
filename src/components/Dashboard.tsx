import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { httpClient, withAxios } from "../utils/AxiosInstance";
import LicenseTypeChart from "./charts/LicenseTypeChart";
import ExpiringSoonChart from "./charts/ExpiringSoonChart";
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
  const [licenseTypeCount, setLicenseTypeCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics();
    getLicenseCounts();
    getExpiringSoon();
    getSetupProgress();
  }, []);

  // Fetch counts used to drive the first-run setup checklist.
  const getSetupProgress = async () => {
    await httpClient
      .get(`${API_BASE_URL}/licenses`)
      .then((res) => {
        setLicenseTypeCount(Array.isArray(res.data) ? res.data.length : 0);
      })
      .catch(() => {
        /* non-critical for the checklist */
      });
  };

  const getMetrics = async () => {
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
        {(() => {
          const hasLicenseTypes = licenseTypeCount > 0;
          const hasEmployees = (metrics?.totalEmployees ?? 0) > 0;
          const hasAssignments = assignmentCount > 0;
          const allDone = hasLicenseTypes && hasEmployees && hasAssignments;
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

          return (
            <div className="mb-6 rounded-box border border-base-content/10 bg-base-100 p-4">
              <h3 className="text-lg font-semibold">Getting started</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {step(hasLicenseTypes, "Create a license type in the License Types view.")}
                {step(hasEmployees, "Add your first employee.")}
                {step(hasAssignments, "Assign a license to an employee.")}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {!hasLicenseTypes && (
                  <Link to="/license-types" className="btn btn-sm btn-primary">
                    Add license type
                  </Link>
                )}
                {!hasEmployees && (
                  <Link to="/employees" className="btn btn-sm btn-primary">
                    Add employee
                  </Link>
                )}
                {hasEmployees && !hasAssignments && (
                  <Link to="/employees" className="btn btn-sm btn-primary">
                    Assign a license
                  </Link>
                )}
              </div>
            </div>
          );
        })()}

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
            <div className="stat-desc ">Total Sent</div>
          </div>
        </div>
      </div>
    );
  }
}
export default withAxios(Dashboard);
