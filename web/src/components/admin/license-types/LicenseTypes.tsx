import { useEffect, useState } from "react";
import axios from "axios";

function LicenseTypes() {
  const api = "http://localhost:8080/license-type";

  interface LicenseType {
    id: number;
    name: string;
  }

  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLicenseType, setCurrentLicenseType] =
    useState<LicenseType | null>(null);

  useEffect(() => {
    getLicenseTypes();
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

    // Create a new object from the form inputs
    const formData = new FormData(event.currentTarget);
    const licenseTypeData = {
      name: formData.get("name") as string,
    };

    if (isEditing && currentLicenseType) {
      axios
        .put(`${api}/${currentLicenseType.id}`, licenseTypeData)
        .then((res) => {
          console.log("License Type updated successfully:", res.data);
          showToast("License Type updated successfully!", "success");
          (
            document.getElementById("addLicenseTypeForm") as HTMLFormElement
          )?.reset();

          // Update the list
          setLicenseTypes((prevLicenseTypes) =>
            prevLicenseTypes.map((lic) => (lic.id === lic.id ? res.data : lic))
          );
          // Close the modal
          (
            document.getElementById("add-edit-modal") as HTMLDialogElement
          )?.close();
        })
        .catch((err) => {
          console.error("Error updating License Type:", err);
          showToast(
            "Failed to update License Type. Please try again.",
            "error"
          );
        });
    } else {
      // Send a POST request to the API
      axios
        .post(api, licenseTypeData)
        .then((res) => {
          console.log("License Type added successfully:", res.data);
          showToast("License Type added successfully!", "success");
          // refresh the list
          getLicenseTypes();

          // event.currentTarget.reset();
          (document.getElementById("addEditForm") as HTMLFormElement)?.reset();
          // Close the modal
          (document.getElementById("add-modal") as HTMLDialogElement)?.close();
        })
        .catch((err) => {
          console.error("Error adding License Type:", err);
          showToast(
            "An error happened when trying to add License Type.",
            "error"
          );
        });
    }
  };

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the ID to delete (you can pass it as a hidden input in the form or store it in state)
    const formData = new FormData(event.currentTarget);
    const licenseTypeId = formData.get("licenseTypeId") as string;

    // Send a DELETE request to the API
    axios
      .delete(`${api}/${licenseTypeId}`)
      .then((res) => {
        console.log("License Type deleted successfully:", res.data);
        showToast("License Type deleted successfully", "success");
        // Refresh the  list
        setLicenseTypes((prevLicenseTypes) =>
          prevLicenseTypes.filter(
            (license) => license.id.toString() !== licenseTypeId
          )
        );

        // Close the modal
        (document.getElementById("delete-modal") as HTMLDialogElement)?.close();
      })
      .catch((err) => {
        console.error("Error deleting License Type:", err);
        showToast("Failed to delete License Type. Please try again.", "error");
      });
  };

  const getLicenseTypes = () => {
    setIsLoading(true);
    axios
      .get(api)
      .then((res) => {
        setLicenseTypes(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Failed to fetch License Types");
      });
  };

  const handleCloseModal = () => {
    // Reset the form and close the modal

    const modal = document.getElementById(
      "add-edit-modal"
    ) as HTMLDialogElement;
    modal.close();

    const form = document.getElementById("addEditForm") as HTMLFormElement;
    form.reset();
    setCurrentLicenseType(null); // Clear the current
    setIsEditing(false); // Reset to add mode
  };
  if (error) {
    return <h1 className="text-xl font-bold mb-4">{error}</h1>;
  } else if (isLoading) {
    return <h1 className="text-xl font-bold mb-4">Loading...</h1>;
  } else if (licenseTypes.length === 0) {
    return <h1 className="text-xl font-bold mb-4">no license types found</h1>;
  } else {
    return (
      <div>
        <div id="toast-container" className="fixed top-4 right-4 z-50"></div>

        <h2 className="text-xl font-bold mb-4">
          License Types
          <button
            className="btn float-right"
            onClick={() => {
              setIsEditing(false); // Set to add mode
              setCurrentLicenseType(null); // Clear current
              (
                document.getElementById("add-edit-modal") as HTMLDialogElement
              )?.showModal();
            }}
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
          <table className="table table-fixed">
            <thead>
              <tr>
                <th className="w-50"></th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {licenseTypes?.map((license, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <ul className="menu menu-horizontal bg-base-200  rounded-box">
                        <li>
                          <a
                            onClick={() => {
                              setIsEditing(true); // Set to edit mode
                              setCurrentLicenseType(license);
                              (
                                document.getElementById(
                                  "add-edit-modal"
                                ) as HTMLDialogElement
                              )?.showModal();
                            }}
                          >
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
                          <a
                            onClick={() => {
                              const licneseTypeIdInput =
                                document.getElementById(
                                  "licenseTypeIdToDelete"
                                ) as HTMLInputElement;
                              licneseTypeIdInput.value = license.id.toString();

                              // Show the delete modal
                              (
                                document.getElementById(
                                  "delete-modal"
                                ) as HTMLDialogElement
                              )?.showModal();
                            }}
                          >
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

                    <td>{license.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <dialog id="delete-modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg my-5">
              Are you sure you wish to delete this license type?
            </h3>

            <form id="deleteForm" onSubmit={handleDelete}>
              <input
                type="hidden"
                name="licenseTypeId"
                id="licenseTypeIdToDelete"
              />
              <button className="btn float-right btn-error mt-2">
                Yes, delete
              </button>
            </form>
          </div>
        </dialog>

        <dialog id="add-edit-modal" className="modal">
          <div className="modal-box">
            {/* <form method="dialog"> */}
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            {/* </form> */}
            <h3 className="font-bold text-lg">Add License Type</h3>

            <form id="addLicenseTypeForm" onSubmit={handleSubmit}>
              <label className="input validator mt-2">
                <input
                  type="text"
                  required
                  className=""
                  name="lastName"
                  placeholder="Last Name"
                  defaultValue={currentLicenseType?.name || ""} // Populate when editing
                />
              </label>
              <p className="validator-hint  hidden mt-1 mb-2">Required</p>

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

export default LicenseTypes;
