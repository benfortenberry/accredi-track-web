import { useEffect, useState } from "react";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  QuestionMarkIcon,
  EmailIcon,
  PhoneIcon,
} from "../../utils/SvgIcons";
import { showToast, formatPhoneNumber } from "../../utils/Utilities";
import config from "../../config";
import { httpClient, withAxios } from "../../utils/AxiosInstance";
import { useAuth0 } from "@auth0/auth0-react";

function Employees() {
  const { user, isAuthenticated } = useAuth0();

  console.log(user, isAuthenticated);

  const api = `${config.apiBaseUrl}/employees`;

  interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    phone1: string;
    email: string;
    status: string;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Tracks if the modal is in edit mode
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null); // Stores the employee being edited

  useEffect(() => {
    getEmployees();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a new employee object from the form inputs
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

          // Update the employee list
          setEmployees((prevEmployees) =>
            prevEmployees.map((employee) =>
              employee.id === currentEmployee.id ? res.data : employee
            )
          );
          // Close the modal
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error updating employee:", err);
          showToast("Failed to update employee. Please try again.", "error");
        });
    } else {
      // Send a POST request to the API
      httpClient
        .post(api, employeeData)
        .then((res) => {
          console.log("Employee added successfully:", res.data);
          showToast("Employee added successfully!", "success");
          // Optionally, refresh the employee list
          getEmployees();

          // event.currentTarget.reset();
          (
            document.getElementById("addEmployeeForm") as HTMLFormElement
          )?.reset();
          // Close the modal
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error adding employee:", err);
          showToast("An error happened when trying to add employee.", "error");
        });
    }
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the employee ID to delete (you can pass it as a hidden input in the form or store it in state)
    const formData = new FormData(event.currentTarget);
    const employeeId = formData.get("employeeId") as string;

    // Send a DELETE request to the API
    httpClient
      .delete(`${api}/${employeeId}`)
      .then((res) => {
        console.log("Employee deleted successfully:", res.data);
        showToast("Employee deleted successfully", "success");
        // Refresh the employee list
        //getExmployees();
        setEmployees((prevEmployees) =>
          prevEmployees.filter(
            (employee) => employee.id.toString() !== employeeId
          )
        );

        // Close the modal
        (document.getElementById("delete-modal") as HTMLDialogElement)?.close();
      })
      .catch((err) => {
        console.error("Error deleting employee:", err);
        showToast("Failed to delete employee. Please try again.", "error");
      });
  };

  const getEmployees = () => {
    setIsLoading(true);
    httpClient
      .get(api)
      .then((res) => {
        setEmployees(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch employees");
      });
  };

  const handleCloseModal = () => {
    // Reset the form and close the modal

    const modal = document.getElementById(
      "add-edit-modal"
    ) as HTMLDialogElement;
    modal.close();

    const form = document.getElementById("addEmployeeForm") as HTMLFormElement;
    form.reset();
    setCurrentEmployee(null); // Clear the current employee
    setIsEditing(false); // Reset to add mode
  };
  if (error) {
    return <h1 className="text-xl font-bold mb-4">{error}</h1>;
  } else if (isLoading) {
    return <h1 className="text-xl font-bold mb-4">Loading...</h1>;
  } else {
    return (
      <div>
        <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>

        <h2 className="text-xl font-bold mb-4">
          {" "}
          Employees{" "}
          <button
            className="btn btn-circle float-right"
            onClick={() => {
              setIsEditing(false); // Set to add mode
              setCurrentEmployee(null); // Clear current employee
              (
                document.getElementById("add-edit-modal") as HTMLDialogElement
              )?.showModal();
            }}
          >
            <AddIcon />
          </button>
        </h2>

        {employees && employees.length > 0 ? (
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>
                    Status
                    <div className="tooltip tooltip-right">
                      <div className="tooltip-content text-left p-3 pt-5">
                        <div className="status   status-success "></div> - All
                        Licenses Current
                        <br />
                        <div className="status  status-error "></div> - Some or
                        All Licences Expired
                      </div>
                      <button className="ml-2">
                        <QuestionMarkIcon />
                      </button>
                    </div>
                  </th>

                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees?.map((employee, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <ul className="menu menu-horizontal bg-base-200  rounded-box">
                          <li>
                            <a
                              onClick={() => {
                                setIsEditing(true); // Set to edit mode
                                setCurrentEmployee(employee); // Set the employee to be edited
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
                                // Set the employee ID in the hidden input field
                                const employeeIdInput = document.getElementById(
                                  "employeeIdToDelete"
                                ) as HTMLInputElement;
                                employeeIdInput.value = employee.id.toString();

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
                      <td className="">
                        <ul className="menu menu-horizontal bg-base-200 float-right  rounded-box">
                          <li>
                            <a href={`/employee/${employee.id}`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="size-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-center text-lg font-bold mt-4">
            Add your first employee
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
              Are you sure you wish to delete this employee?
            </h3>

            <form id="deleteEmployeeForm" onSubmit={handleDelete}>
              <input type="hidden" name="employeeId" id="employeeIdToDelete" />
              <button className="btn float-right btn-error mt-2">
                Yes, delete
              </button>
            </form>
          </div>
        </dialog>

        <dialog id="add-edit-modal" className="modal">
          <div className="modal-box">
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>

            <h3 className="font-bold text-lg">
              {isEditing ? "Edit Employee" : "Add Employee"}
            </h3>

            <form id="addEmployeeForm" onSubmit={handleSubmit}>
              <label className="input validator mt-2">
                <input
                  type="text"
                  required
                  className=""
                  name="lastName"
                  placeholder="Last Name"
                  defaultValue={currentEmployee?.lastName || ""} // Populate when editing
                />
              </label>
              <p className="validator-hint  hidden mt-1 mb-2">Required</p>

              <label className="input validator mt-2 ">
                <input
                  type="text"
                  required
                  className="grow"
                  name="firstName"
                  placeholder="First Name"
                  defaultValue={currentEmployee?.firstName || ""} // Populate when editing
                />
              </label>
              <p className="validator-hint hidden mt-1 mb-2">Required</p>

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
                  defaultValue={currentEmployee?.phone1 || ""} // Populate when editing
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
                  defaultValue={currentEmployee?.email || ""} // Populate when editing
                />
              </label>
              <div className="validator-hint hidden mt-1 mb-2">
                Enter valid email address
              </div>

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

export default withAxios(Employees);
