import { useEffect, useState } from "react";
import axios from "axios";

function Employees() {
  const api = "http://localhost:8080/employees";

  interface Employee {
    firstName: string;
    lastName: string;
    middleName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
    phone1: string;
    phone2?: string; // Optional field
    email: string;
    employerID: number;
    statusID: number;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getExmployees();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    const toast = document.createElement("div");
    toast.className = `alert ${
      type === "success" ? "alert-success" : "alert-error"
    } shadow-lg`;
    toast.innerHTML = `
      <div>
        <span>${message}</span>
      </div>
    `;
    document.getElementById("toast-container")?.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Create a new employee object from the form inputs
    const formData = new FormData(event.currentTarget);
    const newEmployee = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phone1: formData.get("phone1") as string,
      email: formData.get("email") as string,
    };

    // Send a POST request to the API
    axios
      .post(api, newEmployee)
      .then((res) => {
        console.log("Employee added successfully:", res.data);
        showToast("Employee added successfully!", "success");
        // Optionally, refresh the employee list
        getExmployees();
        // Close the modal
        (document.getElementById("my_modal_1") as HTMLDialogElement)?.close();
      })
      .catch((err) => {
        console.error("Error adding employee:", err);
        alert("Failed to add employee. Please try again.");
      });
  };

  const getExmployees = () => {
    setIsLoading(true);
    axios
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
  if (error) {
    return <h1 className="text-xl font-bold mb-4">{error}</h1>;
  } else if (isLoading) {
    return <h1 className="text-xl font-bold mb-4">Loading...</h1>;
  } else if (employees.length === 0) {
    return <h1 className="text-xl font-bold mb-4">no employees found</h1>;
  } else {
    return (
      <div>
        <div id="toast-container" className="fixed top-4 right-4 z-50"></div>

        <h2 className="text-xl font-bold mb-4">
          {" "}
          Employees
          <button
            className="btn float-right"
            onClick={() =>
              (
                document.getElementById("my_modal_1") as HTMLDialogElement
              )?.showModal()
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path d="M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
            </svg>
          </button>
        </h2>
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((employee, i) => {
                return (
                  <tr>
                    <td>
                      {" "}
                      <div className="status status-success float-right"></div>
                    </td>
                    <td>{employee.lastName}</td>
                    <td>{employee.firstName}</td>
                    <td>{employee.phone1}</td>
                    <td>{employee.email}</td>
                    <td className="">
                      <ul className="menu menu-horizontal bg-base-200 float-right  rounded-box">
                        <li>
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="size-5"
                            >
                              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                              <path
                                fillRule="evenodd"
                                d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="size-5"
                            >
                              <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                              <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="size-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
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

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Add Employee</h3>

            <form onSubmit={handleSubmit}>
              <label className="input validator mt-2">
                <input
                  type="text"
                  required
                  className=""
                  name="lastName"
                  placeholder="Last Name"
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
                />
              </label>
              <p className="validator-hint hidden mt-1 mb-2">Required</p>

              <label className="input validator mt-2">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                >
                  <g fill="none">
                    <path
                      d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
                <input
                  type="tel"
                  className="tabular-nums"
                  name="phone1"
                  required
                  placeholder="Phone Number"
                  pattern="[0-9]*"
                  minLength={9}
                  maxLength={9}
                  title="Must be 9 digits"
                />
              </label>
              <p className="validator-hint hidden mt-1 mb-2">
                Must be 9 digits
              </p>

              <label className="input validator mt-2">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                />
              </label>
              <div className="validator-hint hidden mt-1 mb-2">
                Enter valid email address
              </div>

              <button className="btn float-right btn-success mt-2">Add</button>
            </form>
          </div>
        </dialog>
      </div>
    );
  }
}

export default Employees;
