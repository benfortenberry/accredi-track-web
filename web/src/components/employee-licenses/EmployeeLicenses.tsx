import { useEffect, useState } from "react";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
} from "../../utils/SvgIcons";
import { showToast } from "../../utils/Utilities";
import axios from "axios";
import { useParams } from "react-router-dom";

function EmployeeLicenses() {
  const { id } = useParams<{ id: string }>();
  const employeeId = parseInt(id || "0", 10);
  const api = "http://localhost:8080/employee-licenses";
  const employeeApi = "http://localhost:8080/employee";
  const licenseApi = "http://localhost:8080/licenses";

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

  const [currentEmployeeLicense, setCurrentEmployeeLicense] =
    useState<EmployeeLicense | null>(null);

  useEffect(() => {
    getEmployee(employeeId);
    getEmployeeLicenses();
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
      axios
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
      axios
        .post(api, employeeLicenseData)
        .then((res) => {
          console.log("Employee License added successfully:", res.data);
          showToast("Employee License added successfully!", "success");

          getEmployeeLicenses();

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

    console.log("!!!", employeeLicenseId);
    // Send a DELETE request to the API
    axios
      .delete(`${api}/${employeeLicenseId}`)
      .then((res) => {
        console.log("Employee License deleted successfully:", res.data);
        showToast("Employee License deleted successfully", "success");
        // Refresh the employee list
        //getExmployees();
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
    axios
      .get(`${employeeApi}/${employeeId}`) // Replace with your API endpoint
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
    axios
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

  const getEmployeeLicenses = () => {
    setIsLoading(true);
    axios
      .get(api)
      .then((res) => {
        setEmployeeLicenses(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch employee licenses");
      });
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
    form.reset();
    setCurrentEmployeeLicense(null);
    setIsEditing(false); // Reset to add mode
  };
  if (error) {
    return <h1 className="text-xl font-bold mb-4">{error}</h1>;
  } else if (isLoading) {
    return <h1 className="text-xl font-bold mb-4">Loading...</h1>;
  } else {
    return (
      <div>
        <div id="toast-container" className="fixed top-4 right-4 z-50"></div>

        <button
          className="btn btn-circle float-right"
          onClick={() => {
            setIsEditing(false); // Set to add mode
            //   let blankEmployeeLicense: EmployeeLicense = {
            //     employeeId: employeeId,

            //   };
            setCurrentEmployeeLicense(null);
            (
              document.getElementById("add-edit-modal") as HTMLDialogElement
            )?.showModal();
          }}
        >
          <AddIcon />
        </button>

        <a className=" float-left mr-3 mt-1" href="/employees">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </a>
        <h2 className="text-xl font-bold mb-4">
          {employee
            ? `Licenses For ${employee.firstName} ${employee.lastName}`
            : "Loading Employee..."}
        </h2>

        {/* <small className="mb-4">
          {" "}
          {employee ? `${employee.phone1} - ${employee.email}` : ""}
        </small> */}

        {employeeLicenses && employeeLicenses.length > 0 ? (
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>License</th>
                  <th>Issue Date</th>
                  <th>Exp Date</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employeeLicenses?.map((employeeLicense, i) => {
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
                      <td>{employeeLicense.issueDate}</td>
                      <td>{employeeLicense.expDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-center text-lg font-bold mt-4">
            Add your first employee license
          </h3>
        )}

        <dialog id="delete-modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg my-5">
              Are you sure you wish to delete this employee license?
            </h3>

            <form id="deleteEmployeeLicenseForm" onSubmit={handleDelete}>
              <input
                type="hidden"
                name="employeeLicenseId"
                id="employeeLicenseIdToDelete"
              />
              <button className="btn float-right btn-error mt-2">
                Yes, delete
              </button>
            </form>
          </div>
        </dialog>

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

            <h3 className="font-bold text-lg">
              {isEditing ? "Edit Employee License" : "Add Employee License"}
            </h3>

            <form id="addEmployeeLicenseForm" onSubmit={handleSubmit}>
              <select
                name="licenseId"
                id="licenseId"
                required
                className="select mt-3"
                value={currentEmployeeLicense?.licenseId || ""}
                onChange={(e) =>
                  setCurrentEmployeeLicense((prev) => ({
                    ...prev,
                    licenseId: parseInt(e.target.value, 10), // Update licenseId in state
                  }))
                }
              >
                <option value="" disabled>
                  Select a license
                </option>
                {licenses.map((license) => (
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

              <button className="btn float-right btn-success mt-2">
                {isEditing ? "Save" : "Add"}
              </button>
            </form>
          </div>
        </dialog>
      </div>
    );
  }
}

export default EmployeeLicenses;
