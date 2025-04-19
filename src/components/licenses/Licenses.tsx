import { useEffect, useState } from "react";
import { AddIcon, DeleteIcon, EditIcon } from "../../utils/SvgIcons";
import { showToast } from "../../utils/Utilities";
import { httpClient, withAxios } from "../../utils/AxiosInstance";
import DeleteModal from "../modals/DeleteModal";

function Licenses() {
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const api = `${API_BASE_URL}/licenses`;
  const employeeApi = `${API_BASE_URL}/employee`;

  interface License {
    id: number;
    name: string;
    inUseBy: string;
  }

  interface Employee {
    id: number;
    firstName: string;
    lastName: string;
  }

  const [licenses, setLicense] = useState<License[]>([]);
  const [employeeNames, setEmployeeNames] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLicense, setCurrentLicense] = useState<License | null>(null);

  useEffect(() => {
    getLicenses();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const licenseData = {
      name: formData.get("name") as string,
    };

    if (isEditing && currentLicense) {
      httpClient
        .put(`${api}/${currentLicense.id}`, licenseData)
        .then((res) => {
          console.log("License updated successfully:", res.data);
          showToast("License updated successfully!", "success");
          (document.getElementById("addEditForm") as HTMLFormElement)?.reset();

          setLicense((prevLicense) =>
            prevLicense.map((lic) => (lic.id === lic.id ? res.data : lic))
          );
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error updating License:", err);
          showToast("Failed to update License. Please try again.", "error");
        });
    } else {
      httpClient
        .post(api, licenseData)
        .then((res) => {
          console.log("License added successfully:", res.data);
          showToast("License added successfully!", "success");
          getLicenses();

          (document.getElementById("addEditForm") as HTMLFormElement)?.reset();
          (document.getElementById("add-modal") as HTMLDialogElement)?.close();
        })
        .catch((err) => {
          console.error("Error adding License:", err);
          showToast("An error happened when trying to add License.", "error");
        });
    }
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const licenseId = formData.get("licenseId") as string;

    httpClient
      .delete(`${api}/${licenseId}`)
      .then((res) => {
        console.log("License deleted successfully:", res.data);
        showToast("License deleted successfully", "success");
        setLicense((prevLicense) =>
          prevLicense.filter((license) => license.id.toString() !== licenseId)
        );

        (document.getElementById("delete-modal") as HTMLDialogElement)?.close();
      })
      .catch((err) => {
        console.error("Error deleting License:", err);
        showToast("Failed to delete License. Please try again.", "error");
      });
  };

  const checkInUse = (license: License) => {
    if (license.inUseBy) {
      const employeeIdArray = JSON.parse(license.inUseBy);
      const uniqueArray = employeeIdArray.reduce(
        (accumulator: any, current: any) => {
          if (!accumulator.includes(current)) {
            accumulator.push(current);
          }
          return accumulator;
        },
        []
      );

      setEmployeeNames([]);
      uniqueArray.forEach(async function (number: number) {
        await httpClient
          .get(`${employeeApi}/${number}`)
          .then((res) => {
            employeeNames.push(res.data);
            setEmployeeNames((prevItems) => [...prevItems, res.data]);
          })
          .catch((err) => {
            console.error("Error fetching employee details:", err);
            showToast(
              "Failed to fetch employee details. Please try again.",
              "error"
            );
          });
      });

      (
        document.getElementById("in-use-modal") as HTMLDialogElement
      )?.showModal();
    } else {
      const licneseIdInput = document.getElementById(
        "licenseIdToDelete"
      ) as HTMLInputElement;
      licneseIdInput.value = license.id.toString();

      (
        document.getElementById("delete-modal") as HTMLDialogElement
      )?.showModal();
    }
  };

  const getLicenses = () => {
    setIsLoading(true);
    httpClient
      .get(api)
      .then((res) => {
        if (res.data) {
          setLicense(res.data);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch License");
      });
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "add-edit-modal"
    ) as HTMLDialogElement;
    modal.close();

    const form = document.getElementById("addEditForm") as HTMLFormElement;
    if (form) {
      form.reset();
    }

    setCurrentLicense(null);
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
          License Types
          <button
            className="btn btn-circle float-right"
            onClick={() => {
              setIsEditing(false);
              setCurrentLicense(null);
              (
                document.getElementById("add-edit-modal") as HTMLDialogElement
              )?.showModal();
            }}
          >
            <AddIcon />
          </button>
        </h2>
        {licenses && licenses.length > 0 ? (
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table table-fixed">
              <thead>
                <tr>
                  <th className="w-50"></th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {licenses?.map((license, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <ul className="menu menu-horizontal bg-base-200  rounded-box">
                          <li>
                            <a
                              onClick={() => {
                                setIsEditing(true);
                                setCurrentLicense(license);
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
                                checkInUse(license);
                              }}
                            >
                              <DeleteIcon />
                            </a>
                          </li>
                        </ul>
                      </td>

                      <td>{license.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-center text-lg font-bold mt-4">
            Add your first Licesne Type
          </h3>
        )}
        <DeleteModal delete={handleDelete} label="license" text="Are you sure you wish to delete this license type?" />
        <dialog id="in-use-modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-3">
              License Type cannot be deleted
            </h3>

            <p>This license type is currently in use by:</p>
            <ul>
              {employeeNames &&
                employeeNames.map((emp) => (
                  <li key={emp.id}>
                  <a className="btn btn-link pl-0" href={`employee/${emp.id}?r=l`}>
                   {emp.firstName} {emp.lastName}
                   </a>
                  </li>
                ))}
            </ul>

            <br />
            <p> Delete from those employee(s) and try again.</p>
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
            {((licenses && licenses.length < 5) || isEditing) && (
              <h3 className="font-bold text-lg">
                {isEditing ? "Edit License Type" : "Add License Type"}
              </h3>
            )}
            {((licenses && licenses.length < 5) || isEditing) && (
              <form id="addEditForm" onSubmit={handleSubmit}>
                <label className="input validator mt-2">
                  <input
                    type="text"
                    required
                    className=""
                    name="name"
                    placeholder="License Name"
                    defaultValue={currentLicense?.name || ""}
                  />
                </label>
                <p className="validator-hint  hidden mt-1 mb-2">Required</p>

                <button className="btn float-right btn-primary mt-2">
                  {isEditing ? "Save" : "Add"}
                </button>
              </form>
            )}
            {licenses && licenses.length >= 5 && !isEditing && (
              <p>Become a PRO subscriber to add more license types.</p>
            )}
          </div>
        </dialog>
      </div>
    );
  }
}

export default withAxios(Licenses);
