import { useEffect, useState } from "react";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  BackIcon,
} from "../../utils/SvgIcons";
import { showToast, formatDate, getLicenseStatus } from "../../utils/Utilities";

import { httpClient, withAxios } from "../../utils/AxiosInstance";
import { getApiBaseUrl } from "../../utils/config";
import DeleteModal from "../modals/DeleteModal";
import UpgradeCta from "../UpgradeCta";
import ErrorState from "../ErrorState";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function EmployeeLicenses() {
  const API_BASE_URL = getApiBaseUrl();

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const referral = searchParams.get("r");

  const employeeId = parseInt(id || "0", 10);

  const api = `${API_BASE_URL}/employee-licenses`;
  const employeeApi = `${API_BASE_URL}/employee`;
  const licenseApi = `${API_BASE_URL}/licenses`;

  const { aUser } = useUser();

  interface EmployeeLicense {
    id?: number;
    employeeId?: number;
    firstName?: string;
    lastName?: string;
    phone1?: string;
    email?: string;
    licenseName?: string;
    licenseId?: number;
    issueDate?: string;
    expDate?: string;
  }

  interface EmployeeInfo {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }

  interface License {
    id?: number;
    name?: string;
  }

  const [employeeLicenses, setEmployeeLicenses] = useState<EmployeeLicense[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null); // State to store employee details
  const [licenses, setLicense] = useState<License[]>([]);

  const navigate = useNavigate();

  const [currentEmployeeLicense, setCurrentEmployeeLicense] =
    useState<EmployeeLicense | null>(null);

  // Inline license-type creation: lets a user create the license category they
  // need without leaving this page, so the employee-first onboarding flow never
  // dead-ends. `isCreatingLicense` toggles the mini-form inside the modal.
  const [isCreatingLicense, setIsCreatingLicense] = useState(false);
  const [newLicenseName, setNewLicenseName] = useState("");
  const [isSavingLicense, setIsSavingLicense] = useState(false);

  const hasLicenseTypes = Array.isArray(licenses) && licenses.length > 0;

  // Prefer the backend's specific error message over generic fallback text.
  const serverMessage = (err: any, fallback: string): string =>
    err?.response?.data?.error || fallback;

  // Create a license type inline (POST /licenses), then refresh the dropdown and
  // preselect the new type so the user can immediately assign it. Surfaces the
  // backend's free-tier 403 message when the license-type cap is hit.
  const createLicenseInline = () => {
    const name = newLicenseName.trim();
    if (!name) {
      showToast("Enter a name for the license type.", "error");
      return;
    }
    setIsSavingLicense(true);
    httpClient
      .post(licenseApi, { name })
      .then((res) => {
        const newId = res.data?.id as number | undefined;
        showToast("License type created.", "success");
        setNewLicenseName("");
        setIsCreatingLicense(false);
        // Refresh the list, then preselect the newly created type.
        httpClient
          .get(licenseApi)
          .then((listRes) => {
            setLicense(listRes.data);
            if (newId != null) {
              setCurrentEmployeeLicense((prev) => ({
                ...prev,
                licenseId: newId,
              }));
            }
          })
          .catch(() => {
            /* non-critical; the select just won't preselect */
          })
          .finally(() => setIsSavingLicense(false));
      })
      .catch((err) => {
        setIsSavingLicense(false);
        showToast(
          serverMessage(err, "Failed to create license type. Please try again."),
          "error"
        );
      });
  };

  useEffect(() => {
    getEmployee(employeeId);
    getEmployeeLicenses(employeeId);
    getLicenses();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.currentTarget);

    const employeeLicenseData = {
      employeeId,
      licenseId: Number(formData.get("licenseId")),
      issueDate: formData.get("issueDate") as string,
      expDate: formData.get("expDate") as string,
    };

    // Expiration cannot be before the issue date. ISO YYYY-MM-DD strings compare
    // correctly lexicographically, so a string compare is sufficient here.
    if (
      employeeLicenseData.issueDate &&
      employeeLicenseData.expDate &&
      employeeLicenseData.expDate < employeeLicenseData.issueDate
    ) {
      showToast(
        "Expiration date must be on or after the issue date.",
        "error"
      );
      return;
    }

    if (isEditing && currentEmployeeLicense) {
      httpClient
        .put(`${api}/${currentEmployeeLicense.id}`, employeeLicenseData)
        .then((res) => {
          console.log("Employee License updated successfully:", res.data);
          showToast("Employee License updated successfully!", "success");
          (
            document.getElementById("addEmployeeLicenseForm") as HTMLFormElement
          )?.reset();

          // Update the employee list
          setEmployeeLicenses((prevEmployeeLicenses) =>
            prevEmployeeLicenses.map((employeeLicense) =>
              employeeLicense.id === currentEmployeeLicense.id
                ? res.data
                : employeeLicense
            )
          );
          // Close the modal
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error updating employee license:", err);
          showToast(
            serverMessage(
              err,
              "Failed to update employee license. Please try again."
            ),
            "error"
          );
        });
    } else {
      // Send a POST request to the API
      httpClient
        .post(api, employeeLicenseData)
        .then((res) => {
          console.log("Employee License added successfully:", res.data);
          showToast("Employee License added successfully!", "success");

          getEmployeeLicenses(employeeId);

          (
            document.getElementById("addEmployeeLicenseForm") as HTMLFormElement
          )?.reset();
          // Close the modal
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error adding employee license:", err);
          showToast(
            serverMessage(
              err,
              "An error happened when trying to add employee license."
            ),
            "error"
          );
        });
    }
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.currentTarget);
    const employeeLicenseId = formData.get("employeeLicenseId") as string;

    // Send a DELETE request to the API
    httpClient
      .delete(`${api}/${employeeLicenseId}`)
      .then((res) => {
        console.log("Employee License deleted successfully:", res.data);
        showToast("Employee License deleted successfully", "success");

        setEmployeeLicenses((prevEmployeeLicenses) =>
          prevEmployeeLicenses.filter(
            (employeeLicense) =>
              employeeLicense?.id?.toString() !== employeeLicenseId
          )
        );

        // Close the modal
        (document.getElementById("delete-modal") as HTMLDialogElement)?.close();
      })
      .catch((err) => {
        console.error("Error deleting employee license:", err);
        showToast(
          serverMessage(
            err,
            "Failed to delete employee license. Please try again."
          ),
          "error"
        );
      });
  };

  const getEmployee = (employeeId: number) => {
    httpClient
      .get(`${employeeApi}/${employeeId}`)
      .then((res) => {
        setEmployee(res.data); // Set the employee details in state
      })
      .catch((err) => {
        console.error("Error fetching employee details:", err);
        showToast(
          "Failed to fetch employee details. Please try again.",
          "error"
        );
      });
  };

  const getLicenses = () => {
    setIsLoading(true);
    setError(null);
    httpClient
      .get(licenseApi)
      .then((res) => {
        setLicense(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch License");
      });
  };

  const getEmployeeLicenses = (employeeId: number) => {
    setIsLoading(true);
    setError(null);
    httpClient
      .get(`${api}/${employeeId}`)
      .then((res) => {
        if (res.data) {
          setEmployeeLicenses(res.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch employee licenses");
      });
  };

  // Re-run all page loads (used by the error-state retry button).
  const reload = () => {
    getEmployee(employeeId);
    getEmployeeLicenses(employeeId);
    getLicenses();
  };

  const getStatus = getLicenseStatus;

  const handleGoBack = () => {
    console.log(referral);
    if (referral) {
      navigate("/license-types");
    } else {
      navigate("/employees");
    }
  };

  const handleCloseModal = () => {
    // Reset the form and close the modal

    const modal = document.getElementById(
      "add-edit-modal"
    ) as HTMLDialogElement;
    modal.close();

    const form = document.getElementById(
      "addEmployeeLicenseForm"
    ) as HTMLFormElement;
    if (form) {
      form.reset();
    }

    setCurrentEmployeeLicense(null);
    setIsEditing(false);
    setIsCreatingLicense(false);
    setNewLicenseName("");
  };
  if (error) {
    return <ErrorState detail={error} onRetry={reload} />;
  } else if (isLoading || !aUser) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  } else {
    return (
      <div>
        <button
          className="btn btn-circle float-right"
          onClick={() => {
            setIsEditing(false);
            setCurrentEmployeeLicense(null);
            (
              document.getElementById("add-edit-modal") as HTMLDialogElement
            )?.showModal();
          }}
        >
          <AddIcon />
        </button>

        <button
          type="button"
          className="float-left mr-3 mt-1"
          onClick={handleGoBack}
          aria-label="Go back"
        >
          <BackIcon />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {employee
            ? `Licenses for ${employee.firstName} ${employee.lastName}`
            : "Loading Employee..."}
        </h2>

        {!hasLicenseTypes && (
          <div className="alert alert-info mb-4">
            <span>
              No license types yet. Add one and assign it to this employee — you
              can do it all right here.
            </span>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setIsEditing(false);
                setCurrentEmployeeLicense(null);
                setIsCreatingLicense(true);
                setNewLicenseName("");
                (
                  document.getElementById("add-edit-modal") as HTMLDialogElement
                )?.showModal();
              }}
            >
              Add a license
            </button>
          </div>
        )}

        {employeeLicenses && employeeLicenses.length > 0 ? (
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>License Type</th>
                  <th>Issue Date</th>
                  <th>Exp Date</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employeeLicenses &&
                  employeeLicenses?.map((employeeLicense, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          <ul className="menu menu-horizontal bg-base-200  rounded-box">
                            <li>
                              <button
                                type="button"
                                aria-label={`Edit ${employeeLicense.licenseName || "credential"}`}
                                onClick={() => {
                                  setIsEditing(true);
                                  setCurrentEmployeeLicense(employeeLicense);
                                  (
                                    document.getElementById(
                                      "add-edit-modal"
                                    ) as HTMLDialogElement
                                  )?.showModal();
                                }}
                              >
                                <EditIcon />
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                aria-label={`Delete ${employeeLicense.licenseName || "credential"}`}
                                onClick={() => {
                                  const employeeLicenseIdInput =
                                    document.getElementById(
                                      "employeeLicenseIdToDelete"
                                    ) as HTMLInputElement;
                                  employeeLicenseIdInput.value =
                                    employeeLicense?.id?.toString() || "";

                                  // Show the delete modal
                                  (
                                    document.getElementById(
                                      "delete-modal"
                                    ) as HTMLDialogElement
                                  )?.showModal();
                                }}
                              >
                                <DeleteIcon />
                              </button>
                            </li>
                          </ul>
                        </td>

                        <td>{employeeLicense.licenseName}</td>
                        <td>{formatDate(employeeLicense.issueDate || "")}</td>
                        <td>
                          {formatDate(employeeLicense.expDate || "")}

                          <div
                            className={`status status-xl text-center ml-3 mb-1 ${
                              getStatus(employeeLicense.expDate) === "Active"
                                ? "status-success"
                                : "status-error"
                            }`}
                          ></div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center mt-6 rounded-box border border-base-content/10 bg-base-100 p-6">
            <button
              className="text-lg font-bold underline-offset-4 hover:underline"
              onClick={() => {
                setIsEditing(false);
                setCurrentEmployeeLicense(null);
                setIsCreatingLicense(!hasLicenseTypes);
                setNewLicenseName("");
                (
                  document.getElementById("add-edit-modal") as HTMLDialogElement
                )?.showModal();
              }}
            >
              Add your first credential
            </button>
            <p className="mt-2 text-sm opacity-80">
              {hasLicenseTypes
                ? "Pick a license type, set the issue and expiration dates, and you're done."
                : "You'll create a license type and assign it in one step — no need to leave this page."}
            </p>
          </div>
        )}

        <DeleteModal
          delete={handleDelete}
          label="employeeLicense"
          text="Are you sure you wish to delete this license?"
        />

        <dialog id="add-edit-modal" className="modal">
          <div className="modal-box">
            <input
              type="hidden"
              name="employeeId"
              id="employeeId"
              value={employeeId}
            />

            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>

            {(() => {
              // A free user is at the per-employee credential cap (3) unless
              // they're editing an existing one or are pro.
              const atCredentialCap =
                aUser.pro != 1 &&
                !isEditing &&
                employeeLicenses &&
                employeeLicenses.length >= 3;

              if (atCredentialCap) {
                return (
                  <UpgradeCta
                    heading="You've reached the free plan limit"
                    message="Free accounts can add up to 3 credentials per employee. Upgrade to PRO for unlimited credentials."
                  />
                );
              }

              return (
                <>
                  <h3 className="font-bold text-lg">
                    {isEditing ? "Edit Credential" : "Add Credential"}
                  </h3>

                  <form
                    autoComplete="off"
                    id="addEmployeeLicenseForm"
                    onSubmit={handleSubmit}
                  >
                    <fieldset className="fieldset mt-3">
                      <legend className="fieldset-legend">License type</legend>

                      {isCreatingLicense || !hasLicenseTypes ? (
                        // Inline create: name + Save, no page change.
                        <div className="join w-full">
                          <input
                            type="text"
                            className="input join-item grow"
                            placeholder="e.g. CPR Certification"
                            value={newLicenseName}
                            onChange={(e) => setNewLicenseName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                createLicenseInline();
                              }
                            }}
                            aria-label="New license type name"
                          />
                          <button
                            type="button"
                            className="btn btn-primary join-item"
                            onClick={createLicenseInline}
                            disabled={isSavingLicense}
                          >
                            {isSavingLicense ? "Saving..." : "Save type"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            name="licenseId"
                            id="licenseId"
                            required
                            className="select grow"
                            value={currentEmployeeLicense?.licenseId || ""}
                            onChange={(e) =>
                              setCurrentEmployeeLicense((prev) => ({
                                ...prev,
                                licenseId: parseInt(e.target.value, 10),
                              }))
                            }
                          >
                            <option value="" disabled>
                              Select a license type
                            </option>
                            {licenses.map((license) => (
                              <option key={license.id} value={license.id}>
                                {license.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              setIsCreatingLicense(true);
                              setNewLicenseName("");
                            }}
                          >
                            + New type
                          </button>
                        </div>
                      )}

                      {isCreatingLicense && hasLicenseTypes && (
                        <button
                          type="button"
                          className="link link-hover text-xs mt-1 self-start"
                          onClick={() => {
                            setIsCreatingLicense(false);
                            setNewLicenseName("");
                          }}
                        >
                          ← Pick from existing types instead
                        </button>
                      )}
                    </fieldset>

                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Issue Date</legend>
                      <input
                        type="date"
                        className="input validator"
                        required
                        name="issueDate"
                        placeholder="Issue Date"
                        defaultValue={currentEmployeeLicense?.issueDate || ""}
                      />
                      <p className="validator-hint hidden mt-1 mb-2">Required</p>
                    </fieldset>

                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Expiration Date</legend>
                      <input
                        type="date"
                        className="input validator"
                        required
                        name="expDate"
                        placeholder="Expiration Date"
                        defaultValue={currentEmployeeLicense?.expDate || ""}
                      />
                      <p className="validator-hint hidden mt-1 mb-2">Required</p>
                    </fieldset>

                    <button
                      className="btn float-right btn-primary mt-2"
                      disabled={!hasLicenseTypes || isCreatingLicense}
                      title={
                        !hasLicenseTypes || isCreatingLicense
                          ? "Save the license type first"
                          : undefined
                      }
                    >
                      {isEditing ? "Save" : "Add"}
                    </button>
                  </form>
                </>
              );
            })()}
          </div>
        </dialog>
      </div>
    );
  }
}

export default withAxios(EmployeeLicenses);
