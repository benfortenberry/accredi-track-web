import { useEffect, useState } from "react";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  QuestionMarkIcon,
  EmailIcon,
  PhoneIcon,
  RightArrowIcon,
} from "../../utils/SvgIcons";
import { showToast, formatPhoneNumber } from "../../utils/Utilities";
import config from "../../config";
import { httpClient, withAxios } from "../../utils/AxiosInstance";
import DeleteModal from "../modals/DeleteModal";

function Employees() {
  const api = `${config.apiBaseUrl}/employees`;

  interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    phone1: string;
    email: string;
    status: string;
    licenseCount: number;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    getEmployees();
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
          showToast("Failed to update employee. Please try again.", "error");
        });
    } else {
      httpClient
        .post(api, employeeData)
        .then((res) => {
          console.log("Employee added successfully:", res.data);
          showToast("Employee added successfully!", "success");
          getEmployees();

          (
            document.getElementById("addEmployeeForm") as HTMLFormElement
          )?.reset();
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
        showToast("Failed to delete employee. Please try again.", "error");
      });
  };

  const getEmployees = () => {
    setIsLoading(true);
    httpClient
      .get(api)
      .then((res) => {
        if (res.data) {
          setEmployees(res.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch employees");
      });
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
        <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>

        <h2 className="text-xl font-bold mb-4">
          {" "}
          Employees{" "}
          <button
            className="btn btn-circle float-right"
            onClick={() => {
              setIsEditing(false);
              setCurrentEmployee(null);
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
                      <div className="tooltip-content text-left p-2 pt-3">
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
                  <th>License(s)</th>
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
                                setIsEditing(true);
                                setCurrentEmployee(employee);
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
                                const employeeIdInput = document.getElementById(
                                  "employeeIdToDelete"
                                ) as HTMLInputElement;
                                employeeIdInput.value = employee.id.toString();

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
                      <td>{employee.licenseCount}</td>
                      <td className="">
                        <ul className="menu menu-horizontal bg-base-200 float-right  rounded-box">
                          <li>
                            <a href={`/employee/${employee.id}`}>
                              <RightArrowIcon />
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

            {((employees && employees.length <= 4) || isEditing) && (
              <h3 className="font-bold text-lg">
                {isEditing ? "Edit Employee" : "Add Employee"}
              </h3>
            )}

            {((employees && employees.length <= 4) || isEditing) && (
              <form id="addEmployeeForm" onSubmit={handleSubmit}>
               
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
                  {isEditing ? "Save" : "Add"}
                </button>
              </form>
            )}

            {employees && employees.length >= 5 && !isEditing && (
              <p>Become a PRO subscriber to add more employees.</p>
            )}
          </div>
        </dialog>
      </div>
    );
  }
}

export default withAxios(Employees);
