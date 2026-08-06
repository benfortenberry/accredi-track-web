import { useEffect, useState } from "react";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  BackIcon,
  WarningIcon,
} from "../../utils/SvgIcons";
import { showToast, formatDate } from "../../utils/Utilities";

import { httpClient, withAxios } from "../../utils/AxiosInstance";
import { getApiBaseUrl } from "../../utils/config";
import DeleteModal from "../modals/DeleteModal";
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
            "Failed to update employee license. Please try again.",
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
            "An error happened when trying to add employee license.",
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
          "Failed to delete employee license. Please try again.",
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

  const getStatus = (expDate?: string): string => {
    if (!expDate) return "No Expiration Date";
    const today = new Date();
    const expirationDate = new Date(expDate);
    return expirationDate < today ? "Expired" : "Active";
  };

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
  };
  if (error) {
    return <h1 className="text-xl font-bold mb-4">{error}</h1>;
  } else if (isLoading || !aUser) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  } else {
    return (
      <div>
        <div
          id="toast-container "
          className="fixed bottom-4 right-4 z-50"
        ></div>

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

        <a className="float-left mr-3 mt-1" onClick={handleGoBack}>
          <BackIcon />
        </a>
        <h2 className="text-xl font-bold mb-4">
          {employee
            ? `Licenses for ${employee.firstName} ${employee.lastName}`
            : "Loading Employee..."}
        </h2>

        {(!licenses || licenses.length === 0) && (
          <div className="alert alert-info mb-4">
            <span>
              No license types exist yet. Create one first so you can assign it to this employee.
            </span>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => navigate("/license-types")}
            >
              Create license type
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
                              <a
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
                              </a>
                            </li>
                            <li>
                              <a
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
                              </a>
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
                (
                  document.getElementById("add-edit-modal") as HTMLDialogElement
                )?.showModal();
              }}
            >
              Add your first employee license
            </button>
            <p className="mt-2 text-sm opacity-80">
              {licenses && licenses.length > 0
                ? "Use this action to add a license for this employee."
                : "Create a license type first, then come back and add the assignment."}
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

            {(employeeLicenses && employeeLicenses.length < 3) ||
              aUser.pro == 1 ||
              (isEditing && (
                <h3 className="font-bold text-lg">
                  {isEditing ? "Edit Employee License" : "Add Employee License"}
                </h3>
              ))}
            {((employeeLicenses && employeeLicenses.length < 3) ||
              isEditing ||
              aUser.pro == 1) && (
              <form autoComplete="off" id="addEmployeeLicenseForm" onSubmit={handleSubmit}>
                {(!licenses || licenses.length === 0) && (
                  <div role="alert" className="alert mt-3 alert-warning">
                    <WarningIcon />

                    <span>
                      No license types are available yet. Create one first and then return here.
                    </span>
                  </div>
                )}
                <select
                  name="licenseId"
                  id="licenseId"
                  required
                  className="select mt-3"
                  value={currentEmployeeLicense?.licenseId || ""}
                  onChange={(e) =>
                    setCurrentEmployeeLicense((prev) => ({
                      ...prev,
                      licenseId: parseInt(e.target.value, 10),
                    }))
                  }
                >
                  <option value="" disabled>
                    Select a license
                  </option>
                  {licenses &&
                    licenses.map((license) => (
                      <option key={license.id} value={license.id}>
                        {license.name}
                      </option>
                    ))}
                </select>

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
                  <p className="validator-hint  hidden mt-1 mb-2">Required</p>
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
                  <p className="validator-hint  hidden mt-1 mb-2">Required</p>
                </fieldset>

                <button className="btn float-right btn-primary mt-2">
                  {isEditing ? "Save" : "Add"}
                </button>
              </form>
            )}

            {employeeLicenses &&
              employeeLicenses.length >= 3 &&
              !isEditing &&
              aUser.pro !=1 && (
                <p>Become a PRO subscriber to add more employee licenses.</p>
              )}
          </div>
        </dialog>
      </div>
    );
  }
}

export default withAxios(EmployeeLicenses);
