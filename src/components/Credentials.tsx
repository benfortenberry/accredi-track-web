import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { httpClient, withAxios } from "../utils/AxiosInstance";
import { getApiBaseUrl } from "../utils/config";
import { formatDate, showToast } from "../utils/Utilities";
import { EditIcon, DeleteIcon } from "../utils/SvgIcons";
import ErrorState from "./ErrorState";
import DeleteModal from "./modals/DeleteModal";
import { useUser } from "../context/UserContext";

interface Credential {
  id: number;
  employeeId: number;
  licenseId: number;
  firstName: string;
  lastName: string;
  licenseName: string;
  issueDate: string;
  expDate: string;
  status: "Expired" | "ExpiringSoon" | "Active" | string;
}

interface License {
  id: number;
  name: string;
}

type Filter = "all" | "expiring" | "expired";

// Credentials is the global view of every credential across all employees —
// the answer to "what's expiring, and let me fix it" without drilling into each
// employee. Supports filtering (all / expiring soon / expired) and inline
// edit + delete, reusing the per-credential PUT/DELETE endpoints.
function Credentials() {
  const API_BASE_URL = getApiBaseUrl();
  const api = `${API_BASE_URL}/employee-licenses`;
  const licenseApi = `${API_BASE_URL}/licenses`;

  const { aUser } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<Credential | null>(null);

  // Filter is reflected in the URL (?status=expiring) so the dashboard tiles
  // can deep-link into a filtered view.
  const filter = (searchParams.get("status") as Filter) || "all";

  const serverMessage = (err: any, fallback: string): string =>
    err?.response?.data?.error || fallback;

  useEffect(() => {
    load(true);
  }, []);

  const getCredentials = () =>
    httpClient
      .get(api)
      .then((res) => {
        setCredentials(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setError("Failed to fetch credentials");
      });

  const getLicenses = () =>
    httpClient
      .get(licenseApi)
      .then((res) => {
        setLicenses(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        /* license types drive the edit dropdown; non-fatal for the list */
      });

  const load = (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    setError(null);
    Promise.allSettled([getCredentials(), getLicenses()]).finally(() =>
      setIsLoading(false)
    );
  };

  const setFilter = (f: Filter) => {
    if (f === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", f);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const visible = credentials.filter((c) => {
    if (filter === "expired") return c.status === "Expired";
    if (filter === "expiring") return c.status === "ExpiringSoon";
    return true;
  });

  // Status shown as a colored dot + plain label (not text-on-color), so the
  // punchy status hues never need to carry readable text.
  const statusBadge = (status: string) => {
    const map: Record<string, { dot: string; label: string }> = {
      Expired: { dot: "status-error", label: "Expired" },
      ExpiringSoon: { dot: "status-warning", label: "Expiring soon" },
      Active: { dot: "status-success", label: "Active" },
    };
    const { dot, label } = map[status] ?? map.Active;
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className={`status status-sm ${dot}`}></span>
        {label}
      </span>
    );
  };

  const employeeName = (c: Credential) =>
    `${c.firstName} ${c.lastName}`.trim() || "(deleted employee)";

  // ── Edit ──────────────────────────────────────────────────────────
  const openEdit = (c: Credential) => {
    setCurrent(c);
    (document.getElementById("credential-edit-modal") as HTMLDialogElement)?.showModal();
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!current) return;
    const formData = new FormData(event.currentTarget);
    const payload = {
      employeeId: current.employeeId,
      licenseId: Number(formData.get("licenseId")),
      issueDate: formData.get("issueDate") as string,
      expDate: formData.get("expDate") as string,
    };
    if (payload.expDate && payload.issueDate && payload.expDate < payload.issueDate) {
      showToast("Expiration date must be on or after the issue date.", "error");
      return;
    }
    httpClient
      .put(`${api}/${current.id}`, payload)
      .then(() => {
        showToast("Credential updated.", "success");
        (document.getElementById("credential-edit-modal") as HTMLDialogElement)?.close();
        setCurrent(null);
        getCredentials(); // refresh (no spinner)
      })
      .catch((err) => {
        showToast(serverMessage(err, "Failed to update credential."), "error");
      });
  };

  // ── Delete ────────────────────────────────────────────────────────
  const openDelete = (c: Credential) => {
    const input = document.getElementById(
      "credentialIdToDelete"
    ) as HTMLInputElement;
    input.value = c.id.toString();
    (document.getElementById("delete-modal") as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = formData.get("credentialId") as string;
    httpClient
      .delete(`${api}/${id}`)
      .then(() => {
        showToast("Credential deleted.", "success");
        setCredentials((prev) => prev.filter((c) => c.id.toString() !== id));
        (document.getElementById("delete-modal") as HTMLDialogElement)?.close();
      })
      .catch((err) => {
        showToast(serverMessage(err, "Failed to delete credential."), "error");
      });
  };

  if (error) {
    return <ErrorState detail={error} onRetry={() => load(true)} />;
  } else if (isLoading || !aUser) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  }

  const filterTab = (f: Filter, label: string) => (
    <button
      type="button"
      role="tab"
      className={`tab ${filter === f ? "tab-active" : ""}`}
      onClick={() => setFilter(f)}
    >
      {label}
    </button>
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Credentials</h2>
      <p className="text-sm text-base-content/60 mb-4">
        Every credential across your team, soonest to expire first.
      </p>

      <div role="tablist" className="tabs tabs-boxed mb-4 w-fit">
        {filterTab("all", "All")}
        {filterTab("expiring", "Expiring soon")}
        {filterTab("expired", "Expired")}
      </div>

      {visible.length > 0 ? (
        <>
          {/* Desktop / tablet: table (sm and up). */}
          <div className="hidden sm:block overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>License Type</th>
                  <th>Issued</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th className="w-1 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c) => (
                  <tr key={c.id}>
                    <td>{employeeName(c)}</td>
                    <td>{c.licenseName || "(deleted license type)"}</td>
                    <td>{c.issueDate ? formatDate(c.issueDate) : "—"}</td>
                    <td>{formatDate(c.expDate || "")}</td>
                    <td>{statusBadge(c.status)}</td>
                    <td className="w-1 whitespace-nowrap">
                      <div className="flex gap-1 justify-end">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`Edit ${c.licenseName} for ${employeeName(c)}`}
                          onClick={() => openEdit(c)}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-square"
                          aria-label={`Delete ${c.licenseName} for ${employeeName(c)}`}
                          onClick={() => openDelete(c)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards (below sm). */}
          <ul className="sm:hidden space-y-3">
            {visible.map((c) => (
              <li
                key={c.id}
                className="rounded-box border border-base-content/10 bg-base-100 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">
                        {c.licenseName || "(deleted license type)"}
                      </span>
                      {statusBadge(c.status)}
                    </div>
                    <div className="text-sm text-base-content/70 mt-1 truncate">
                      {employeeName(c)}
                    </div>
                    <div className="text-xs text-base-content/50 mt-1">
                      Expires {formatDate(c.expDate || "")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square"
                      aria-label={`Edit ${c.licenseName} for ${employeeName(c)}`}
                      onClick={() => openEdit(c)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square"
                      aria-label={`Delete ${c.licenseName} for ${employeeName(c)}`}
                      onClick={() => openDelete(c)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center mt-6 rounded-box border border-base-content/10 bg-base-100 p-8">
          <h3 className="text-lg font-bold">
            {filter === "all"
              ? "No credentials yet"
              : filter === "expiring"
              ? "Nothing expiring soon"
              : "Nothing expired"}
          </h3>
          <p className="mt-2 text-sm opacity-80 max-w-md mx-auto">
            {filter === "all"
              ? "Add employees and assign their licenses to see them here."
              : "Good news — nothing in this category right now."}
          </p>
        </div>
      )}

      <DeleteModal
        delete={handleDelete}
        label="credential"
        text="Are you sure you wish to delete this credential?"
      />

      {/* Edit modal */}
      <dialog id="credential-edit-modal" className="modal">
        <div className="modal-box">
          <button
            type="button"
            onClick={() => {
              (
                document.getElementById("credential-edit-modal") as HTMLDialogElement
              )?.close();
              setCurrent(null);
            }}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">
            Edit credential
            {current ? ` for ${current.firstName} ${current.lastName}`.trimEnd() : ""}
          </h3>
          {/* key on the row id so the uncontrolled inputs remount and re-apply
              their defaultValues each time a different row is edited (otherwise
              defaultValue only takes effect on first mount). */}
          <form autoComplete="off" onSubmit={handleEditSubmit} key={current?.id ?? "new"}>
            <fieldset className="fieldset mt-3">
              <legend className="fieldset-legend">License type</legend>
              <select
                name="licenseId"
                required
                className="select"
                defaultValue={current?.licenseId ?? ""}
              >
                <option value="" disabled>
                  Select a license type
                </option>
                {licenses.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Issue Date (optional)</legend>
              <input
                type="date"
                className="input"
                name="issueDate"
                defaultValue={current?.issueDate || ""}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Expiration Date</legend>
              <input
                type="date"
                className="input validator"
                required
                name="expDate"
                defaultValue={current?.expDate || ""}
              />
            </fieldset>

            <button className="btn float-right btn-primary mt-2">Save</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default withAxios(Credentials);
