import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddIcon, DeleteIcon, EditIcon } from "../../utils/SvgIcons";
import { showToast } from "../../utils/Utilities";
import { httpClient, withAxios } from "../../utils/AxiosInstance";
import { getApiBaseUrl } from "../../utils/config";
import DeleteModal from "../modals/DeleteModal";
import UpgradeCta from "../UpgradeCta";
import ErrorState from "../ErrorState";
import { useUser } from "../../context/UserContext";

function Licenses() {
  const API_BASE_URL = getApiBaseUrl();
  const api = `${API_BASE_URL}/licenses`;
  const employeeApi = `${API_BASE_URL}/employee`;

  const { aUser } = useUser();

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

  // Prefer the backend's specific error message over generic fallback text.
  const serverMessage = (err: any, fallback: string): string =>
    err?.response?.data?.error || fallback;

  useEffect(() => {
    getLicenses(true);
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
            prevLicense.map((lic) =>
              lic.id === currentLicense.id ? res.data : lic
            )
          );
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error updating License:", err);
          showToast(
            serverMessage(err, "Failed to update License. Please try again."),
            "error"
          );
        });
    } else {
      httpClient
        .post(api, licenseData)
        .then((res) => {
          console.log("License added successfully:", res.data);
          showToast("License added successfully!", "success");
          getLicenses();

          (document.getElementById("addEditForm") as HTMLFormElement)?.reset();
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error adding License:", err);
          showToast(
            serverMessage(err, "An error happened when trying to add License."),
            "error"
          );
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
        showToast(
          serverMessage(err, "Failed to delete License. Please try again."),
          "error"
        );
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

  const getLicenses = (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    setError(null);
    httpClient
      .get(api)
      .then((res) => {
        setLicense(Array.isArray(res.data) ? res.data : []);
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

  // Row action shared between desktop table and mobile cards. (Delete goes
  // through checkInUse, which blocks deletion if the type is assigned.)
  const openEditLicense = (license: License) => {
    setIsEditing(true);
    setCurrentLicense(license);
    (document.getElementById("add-edit-modal") as HTMLDialogElement)?.showModal();
  };

  if (error) {
    return <ErrorState detail={error} onRetry={getLicenses} />;
  } else if (isLoading || !aUser) {
    return (
      <h1 className="text-center">
        <span className="loading loading-dots loading-xl"></span>
      </h1>
    );
  } else {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold">License Types</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setIsEditing(false);
              setCurrentLicense(null);
              (
                document.getElementById("add-edit-modal") as HTMLDialogElement
              )?.showModal();
            }}
          >
            <AddIcon />
            Add
          </button>
        </div>
        {licenses && licenses.length > 0 ? (
          <>
            {/* Desktop / tablet: table (sm and up). */}
            <div className="hidden sm:block overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-1 whitespace-nowrap"></th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((license, i) => (
                    <tr key={i}>
                      <td className="w-1 whitespace-nowrap">
                        <ul className="menu menu-horizontal bg-base-200 rounded-box">
                          <li>
                            <button
                              type="button"
                              aria-label={`Edit ${license.name}`}
                              onClick={() => openEditLicense(license)}
                            >
                              <EditIcon />
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              aria-label={`Delete ${license.name}`}
                              onClick={() => checkInUse(license)}
                            >
                              <DeleteIcon />
                            </button>
                          </li>
                        </ul>
                      </td>
                      <td>{license.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked cards (below sm). */}
            <ul className="sm:hidden space-y-3">
              {licenses.map((license, i) => (
                <li
                  key={i}
                  className="rounded-box border border-base-content/10 bg-base-100 p-4 flex items-center justify-between gap-3"
                >
                  <span className="font-semibold min-w-0 flex-1 truncate">
                    {license.name}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square"
                      aria-label={`Edit ${license.name}`}
                      onClick={() => openEditLicense(license)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square"
                      aria-label={`Delete ${license.name}`}
                      onClick={() => checkInUse(license)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center mt-6 rounded-box border border-base-content/10 bg-base-100 p-6">
            <button
              className="text-lg font-bold underline-offset-4 hover:underline"
              onClick={() => {
                setIsEditing(false);
                setCurrentLicense(null);
                (
                  document.getElementById("add-edit-modal") as HTMLDialogElement
                )?.showModal();
              }}
            >
              Add your first License Type
            </button>
            <p className="mt-2 text-sm opacity-80">
              Create the license categories you’ll use when assigning credentials to employees.
            </p>
          </div>
        )}
        <DeleteModal
          delete={handleDelete}
          label="license"
          text="Are you sure you wish to delete this license type?"
        />
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
                    <Link
                      className="btn btn-link pl-0"
                      to={`/employee/${emp.id}?r=l`}
                    >
                      {emp.firstName} {emp.lastName}
                    </Link>
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
            {((licenses && licenses.length < 5) || isEditing || aUser.pro == 1) && (
              <h3 className="font-bold text-lg">
                {isEditing ? "Edit License Type" : "Add License Type"}
              </h3>
            )}
            {((licenses && licenses.length < 5) || isEditing || aUser.pro == 1) && (
              <form
                autoComplete="off"
                id="addEditForm"
                onSubmit={handleSubmit}
                key={currentLicense?.id ?? "new"}
                className="mt-4"
              >
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">License type name</legend>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    name="name"
                    placeholder="e.g. CPR Certification"
                    defaultValue={currentLicense?.name || ""}
                  />
                </fieldset>

                <div className="mt-4 flex justify-end">
                  <button className="btn btn-primary">
                    {isEditing ? "Save license type" : "Add license type"}
                  </button>
                </div>
              </form>
            )}
            {licenses && licenses.length >= 5 && !isEditing && aUser.pro != 1 && (
              <UpgradeCta
                heading="You've reached the free plan limit"
                message="Free accounts can create up to 5 license types. Upgrade to PRO for unlimited license types."
              />
            )}
          </div>
        </dialog>
      </div>
    );
  }
}

export default withAxios(Licenses);
