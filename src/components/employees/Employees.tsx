import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  QuestionMarkIcon,
  EmailIcon,
  PhoneIcon,
  RightArrowIcon,
  OverflowIcon,
} from "../../utils/SvgIcons";
import { showToast, formatPhoneNumber } from "../../utils/Utilities";
import { httpClient, withAxios } from "../../utils/AxiosInstance";
import { getApiBaseUrl } from "../../utils/config";
import { track } from "../../utils/analytics";
import DeleteModal from "../modals/DeleteModal";
import UpgradeCta from "../UpgradeCta";
import ErrorState from "../ErrorState";
import { useUser } from "../../context/UserContext";

function Employees() {
  const API_BASE_URL = getApiBaseUrl();
  const api = `${API_BASE_URL}/employees`;

  const { aUser } = useUser();

  interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    phone1: string;
    email: string;
    status: string;
    licenseCount: number;
  }

  interface ImportRowError {
    row: number;
    reason: string;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [importSkipped, setImportSkipped] = useState<ImportRowError[]>([]);
  const [importImported, setImportImported] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const navigate = useNavigate();

  // Pull a human-readable message out of an axios error, preferring the
  // backend's specific error text over a generic fallback.
  const serverMessage = (err: any, fallback: string): string =>
    err?.response?.data?.error || fallback;

  useEffect(() => {
    getEmployees(true);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const employeeData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone1: formData.get("phone1") as string,
      email: formData.get("email") as string,
    };

    if (isEditing && currentEmployee) {
      httpClient
        .put(`${api}/${currentEmployee.id}`, employeeData)
        .then((res) => {
          console.log("Employee updated successfully:", res.data);
          showToast("Employee updated successfully!", "success");
          (
            document.getElementById("addEmployeeForm") as HTMLFormElement
          )?.reset();

          setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
              employee.id === currentEmployee.id ? res.data : employee
            )
          );
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error updating employee:", err);
          showToast(
            serverMessage(err, "Failed to update employee. Please try again."),
            "error"
          );
        });
    } else {
      httpClient
        .post(api, employeeData)
        .then((res) => {
          console.log("Employee added successfully:", res.data);
          track("employee_added", { method: "manual" });
          showToast("Employee added! Add a credential next.", "success");
          (
            document.getElementById("addEmployeeForm") as HTMLFormElement
          )?.reset();
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
          navigate(`/employee/${res.data.id}`);
        })
        .catch((err) => {
          console.error("Error adding employee:", err);
          showToast(
            serverMessage(err, "An error happened when trying to add employee."),
            "error"
          );
        });
    }
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const employeeId = formData.get("employeeId") as string;

    httpClient
      .delete(`${api}/${employeeId}`)
      .then((res) => {
        console.log("Employee deleted successfully:", res.data);
        showToast("Employee deleted successfully", "success");

        setEmployees((prevEmployees) =>
          prevEmployees.filter(
            (employee) => employee.id.toString() !== employeeId
          )
        );

        (document.getElementById("delete-modal") as HTMLDialogElement)?.close();
      })
      .catch((err) => {
        console.error("Error deleting employee:", err);
        showToast(
          serverMessage(err, "Failed to delete employee. Please try again."),
          "error"
        );
      });
  };

  // showSpinner=true only for the initial load. Refetches (after add/delete/
  // import/demo) update the list in place without flipping the whole page back
  // to the full-page spinner, which caused a jarring flash.
  const getEmployees = (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    setError(null);
    httpClient
      .get(api)
      .then((res) => {
        if (res.data) {
          setEmployees(res.data);
        } else {
          setEmployees([]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch employees");
      });
  };

  const exportData = () => {
    httpClient
      .get(`${API_BASE_URL}/employee-data`, { responseType: "blob" })
      .then((res) => {
        const blob = new Blob([res.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const stamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        link.href = url;
        link.setAttribute("download", `employee_data_${stamp}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Error exporting employee data:", err);
        showToast(
          serverMessage(err, "Failed to export data. Please try again."),
          "error"
        );
      });
  };

  const downloadTemplate = () => {
    // A correctly-shaped CSV: header row + one example row. Users fill it in and
    // re-upload — removes all guessing about the expected format.
    const csv =
      "First Name,Last Name,Phone,Email\n" +
      "Jane,Doe,5551234567,jane.doe@example.com\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employee_import_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset the input so selecting the same file again re-triggers onChange.
    event.target.value = "";
    if (!file) return;

    // Catch Excel files up front — they aren't CSV and won't parse. Give a
    // clear "save as CSV" message instead of a confusing backend parse error.
    if (/\.(xlsx|xls)$/i.test(file.name)) {
      showToast(
        "That's an Excel file. In Excel or Google Sheets, use File → Save As (or Download) → CSV, then upload the CSV.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsImporting(true);
    httpClient
      .post(`${API_BASE_URL}/employees/import`, formData)
      .then((res) => {
        const imported: number = res.data?.imported ?? 0;
        const skipped: ImportRowError[] = Array.isArray(res.data?.skipped)
          ? res.data.skipped
          : [];
        setImportImported(imported);
        setImportSkipped(skipped);
        if (imported > 0) {
          track("employees_imported", { imported, skipped: skipped.length });
        }
        showToast(
          `Imported ${imported} employee${imported === 1 ? "" : "s"}` +
            (skipped.length ? `, ${skipped.length} skipped` : ""),
          skipped.length ? "error" : "success"
        );
        getEmployees();
        if (skipped.length) {
          (
            document.getElementById("import-result-modal") as HTMLDialogElement
          )?.showModal();
        }
      })
      .catch((err) => {
        console.error("Error importing employees:", err);
        showToast(
          serverMessage(err, "Failed to import CSV. Please try again."),
          "error"
        );
      })
      .finally(() => setIsImporting(false));
  };

  const loadDemoData = () => {
    setIsSeeding(true);
    httpClient
      .post(`${API_BASE_URL}/demo-data`)
      .then(() => {
        showToast("Demo data loaded. Explore, then delete it anytime.", "success");
        getEmployees();
      })
      .catch((err) => {
        console.error("Error loading demo data:", err);
        showToast(
          serverMessage(err, "Failed to load demo data. Please try again."),
          "error"
        );
      })
      .finally(() => setIsSeeding(false));
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "add-edit-modal"
    ) as HTMLDialogElement;
    modal.close();

    const form = document.getElementById("addEmployeeForm") as HTMLFormElement;
    if (form) {
      form.reset();
    }

    setCurrentEmployee(null);
    setIsEditing(false);
  };

  // Row action helpers, shared between the desktop table and the mobile cards.
  const openEdit = (employee: Employee) => {
    setIsEditing(true);
    setCurrentEmployee(employee);
    (document.getElementById("add-edit-modal") as HTMLDialogElement)?.showModal();
  };

  const openDelete = (employee: Employee) => {
    const input = document.getElementById(
      "employeeIdToDelete"
    ) as HTMLInputElement;
    input.value = employee.id.toString();
    (document.getElementById("delete-modal") as HTMLDialogElement)?.showModal();
  };

  if (error) {
    return <ErrorState detail={error} onRetry={getEmployees} />;
  } else if (isLoading || !aUser) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  } else {
    return (
      <div>
        {/* Responsive header: title and actions in a flex row that wraps on
            narrow screens instead of floating over the title. */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold">Employees</h2>
          <div className="flex items-center gap-2">
            {/* Occasional admin actions (import / export / template) tucked into
                an overflow menu so the recurring "Add" action stays primary and
                the header isn't cluttered. */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-square"
                aria-label="Import, export, and template options"
              >
                <OverflowIcon />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-200 rounded-box z-10 mt-2 w-56 p-2 shadow"
              >
                <li>
                  <label>
                    {isImporting ? "Importing..." : "Import CSV"}
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      disabled={isImporting}
                      onChange={handleImportFile}
                    />
                  </label>
                </li>
                {employees && employees.length > 0 && (
                  <li>
                    <button type="button" onClick={exportData}>
                      Export CSV
                    </button>
                  </li>
                )}
                <li>
                  <button type="button" onClick={downloadTemplate}>
                    Download CSV template
                  </button>
                </li>
              </ul>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsEditing(false);
                setCurrentEmployee(null);
                (
                  document.getElementById("add-edit-modal") as HTMLDialogElement
                )?.showModal();
              }}
            >
              <AddIcon />
              Add
            </button>
          </div>
        </div>

        {employees && employees.length > 0 ? (
          <>
            {/* Desktop / tablet: table (sm and up). */}
            <div className="hidden sm:block overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>
                      Status
                      <div className="tooltip tooltip-right">
                        <div className="tooltip-content text-left p-2 pt-3">
                          <div className="status status-success"></div> - All
                          Licenses Current
                          <br />
                          <div className="status status-error"></div> - Some or
                          All Licences Expired
                        </div>
                        <button className="ml-2" aria-label="Status legend">
                          <QuestionMarkIcon />
                        </button>
                      </div>
                    </th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>License(s)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, i) => (
                    <tr key={i}>
                      <td>
                        <ul className="menu menu-horizontal bg-base-200 rounded-box">
                          <li>
                            <button
                              type="button"
                              aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                              onClick={() => openEdit(employee)}
                            >
                              <EditIcon />
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                              onClick={() => openDelete(employee)}
                            >
                              <DeleteIcon />
                            </button>
                          </li>
                        </ul>
                      </td>
                      <td>
                        <div
                          className={`status status-xl text-center ml-3 ${
                            employee.status === "Active"
                              ? "status-success"
                              : "status-error"
                          }`}
                        ></div>
                      </td>
                      <td>{employee.firstName}</td>
                      <td>{employee.lastName}</td>
                      <td>{formatPhoneNumber(employee.phone1)}</td>
                      <td>{employee.email}</td>
                      <td>{employee.licenseCount}</td>
                      <td>
                        <ul className="menu menu-horizontal bg-base-200 float-right rounded-box">
                          <li>
                            <a
                              href={`/employee/${employee.id}`}
                              aria-label={`View credentials for ${employee.firstName} ${employee.lastName}`}
                            >
                              <RightArrowIcon />
                            </a>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards (below sm). */}
            <ul className="sm:hidden space-y-3">
              {employees.map((employee, i) => (
                <li
                  key={i}
                  className="rounded-box border border-base-content/10 bg-base-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <a
                      href={`/employee/${employee.id}`}
                      className="min-w-0 flex-1"
                      aria-label={`View credentials for ${employee.firstName} ${employee.lastName}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`status status-md ${
                            employee.status === "Active"
                              ? "status-success"
                              : "status-error"
                          }`}
                        ></span>
                        <span className="font-semibold truncate">
                          {employee.firstName} {employee.lastName}
                        </span>
                      </div>
                      <div className="text-sm text-base-content/70 mt-1 truncate">
                        {formatPhoneNumber(employee.phone1)}
                      </div>
                      <div className="text-sm text-base-content/70 truncate">
                        {employee.email}
                      </div>
                      <div className="text-xs text-base-content/50 mt-1">
                        {employee.licenseCount} license
                        {employee.licenseCount === 1 ? "" : "s"}
                      </div>
                    </a>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                        onClick={() => openEdit(employee)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                        onClick={() => openDelete(employee)}
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
            <h3 className="text-xl font-bold">Add your first employee</h3>
            <p className="mt-2 text-sm opacity-80 max-w-md mx-auto">
              Save an employee and you'll go straight to their page to add a
              credential — you can create the license type right there, in one
              step.
            </p>

            <button
              className="btn btn-primary mt-5"
              onClick={() => {
                setIsEditing(false);
                setCurrentEmployee(null);
                (
                  document.getElementById("add-edit-modal") as HTMLDialogElement
                )?.showModal();
              }}
            >
              Add an employee
            </button>

            {/* Quiet secondary options: bulk import or explore with demo data. */}
            <div className="divider text-xs opacity-60 max-w-xs mx-auto">
              or
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <label className="btn btn-sm btn-ghost">
                {isImporting ? "Importing..." : "Import a CSV"}
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  disabled={isImporting}
                  onChange={handleImportFile}
                />
              </label>
              <button
                className="btn btn-sm btn-ghost"
                onClick={loadDemoData}
                disabled={isSeeding}
              >
                {isSeeding ? "Loading..." : "Load demo data"}
              </button>
            </div>
            <p className="mt-3 text-xs opacity-60 max-w-md mx-auto">
              Importing? You'll need columns First Name, Last Name, Phone (10
              digits), and Email —{" "}
              <button
                className="link link-hover font-medium"
                onClick={downloadTemplate}
              >
                download the template
              </button>
              . Demo data drops in a few sample employees and licenses you can
              delete anytime.
            </p>
          </div>
        )}

        <DeleteModal
          delete={handleDelete}
          label="employee"
          text="Are you sure you wish to delete this employee? All employee licenses will be deleted as well."
        />

        <dialog id="add-edit-modal" className="modal">
          <div className="modal-box">
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>

            {((employees && employees.length <= 4) ||
              isEditing ||
              aUser.pro == 1) && (
              <h3 className="font-bold text-lg">
                {isEditing ? "Edit Employee" : "Add Employee"}
              </h3>
            )}

            {((employees && employees.length <= 4) ||
              isEditing ||
              aUser.pro == 1) && (
              <form
                autoComplete="off"
                id="addEmployeeForm"
                onSubmit={handleSubmit}
                key={currentEmployee?.id ?? "new"}
              >
                <label className="input validator mt-2 ">
                  <input
                    type="text"
                    required
                    className="grow"
                    name="firstName"
                    placeholder="First Name"
                    defaultValue={currentEmployee?.firstName || ""}
                  />
                </label>
                <p className="validator-hint hidden mt-1 mb-2">Required</p>

                <label className="input validator mt-2">
                  <input
                    type="text"
                    required
                    className=""
                    name="lastName"
                    placeholder="Last Name"
                    defaultValue={currentEmployee?.lastName || ""}
                  />
                </label>
                <p className="validator-hint  hidden mt-1 mb-2">Required</p>

                <label className="input validator mt-2">
                  <PhoneIcon />
                  <input
                    type="tel"
                    className="tabular-nums"
                    name="phone1"
                    required
                    placeholder="Phone Number"
                    pattern="[0-9]*"
                    minLength={10}
                    maxLength={10}
                    title="Must be 10 digits"
                    defaultValue={currentEmployee?.phone1 || ""}
                  />
                </label>
                <p className="validator-hint hidden mt-1 mb-2">
                  Must be 10 digits
                </p>

                <label className="input validator mt-2">
                  <EmailIcon />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    defaultValue={currentEmployee?.email || ""}
                  />
                </label>
                <div className="validator-hint hidden mt-1 mb-2">
                  Enter valid email address
                </div>

                <button className="btn float-right btn-primary mt-2">
                  {isEditing ? "Save employee" : "Add employee"}
                </button>
              </form>
            )}

            {employees &&
              employees.length >= 5 &&
              !isEditing &&
              aUser.pro != 1 && (
                <UpgradeCta
                  heading="You've reached the free plan limit"
                  message="Free accounts can add up to 5 employees. Upgrade to PRO for unlimited employees."
                />
              )}
          </div>
        </dialog>

        <dialog id="import-result-modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-2">Import summary</h3>
            <p className="mb-3">
              Imported {importImported} employee
              {importImported === 1 ? "" : "s"}.
              {importSkipped.length > 0 &&
                ` ${importSkipped.length} row${
                  importSkipped.length === 1 ? "" : "s"
                } skipped:`}
            </p>
            {importSkipped.length > 0 && (
              <p className="text-xs opacity-70 mb-3">
                Expected columns: First Name, Last Name, Phone (10 digits),
                Email.{" "}
                <button
                  className="link link-primary"
                  onClick={downloadTemplate}
                >
                  Download the template
                </button>{" "}
                for the exact format. From a spreadsheet, save as CSV first.
              </p>
            )}
            {importSkipped.length > 0 && (
              <ul className="list-disc pl-5 space-y-1 text-sm max-h-60 overflow-y-auto">
                {importSkipped.map((s, i) => (
                  <li key={i}>
                    Row {s.row}: {s.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </dialog>
      </div>
    );
  }
}

export default withAxios(Employees);
