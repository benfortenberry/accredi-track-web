import { Outlet } from "react-router-dom";
import LogoutButton from "./auth0/LogoutButton";
import logo from "../assets/logo_white2.png";
import logoDark from "../assets/logo_black2.png";
import Payment from "./payment/Payment";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { httpClient } from "../utils/AxiosInstance";
// import { GearIcon } from "../utils/SvgIcons";
function Layout() {
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const api = `${API_BASE_URL}/create-checkout-session`;
  const { getAccessTokenSilently } = useAuth0();

  const [token, setToken] = useState<string>("");

  let accessToken = "";

  useEffect(() => {
    getLicenses();
  }, []);

  const getLicenses = async () => {
    accessToken = await getAccessTokenSilently();
    setToken(accessToken);
    // accessToken = encodeURIComponent(accessToken);
    // console.log(accessToken);
  };

  const handleStripeCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior

    window.location.assign(api);
    console.log("stripe checklout!");
    // const formData = new FormData(event.currentTarget);
    // httpClient
    // .get(api)
    // .then(() => {

    // })
    // .catch(() => {
    // });
    // const employeeLicenseData = {
    //   employeeId,
    //   licenseId: Number(formData.get("licenseId")),
    //   issueDate: formData.get("issueDate") as string,
    //   expDate: formData.get("expDate") as string,
    // };

    // if (isEditing && currentEmployeeLicense) {
    //   httpClient
    //     .put(`${api}/${currentEmployeeLicense.id}`, employeeLicenseData)
    //     .then((res) => {
    //       console.log("Employee License updated successfully:", res.data);
    //       showToast("Employee License updated successfully!", "success");
    //       (
    //         document.getElementById("addEmployeeLicenseForm") as HTMLFormElement
    //       )?.reset();

    //       // Update the employee list
    //       setEmployeeLicenses((prevEmployeeLicenses) =>
    //         prevEmployeeLicenses.map((employeeLicense) =>
    //           employeeLicense.id === currentEmployeeLicense.id
    //             ? res.data
    //             : employeeLicense
    //         )
    //       );
    //       // Close the modal
    //       (
    //         document.getElementById("add-edit-modal") as HTMLDialogElement
    //       )?.close();
    //     })
    //     .catch((err) => {
    //       console.error("Error updating employee license:", err);
    //       showToast(
    //         "Failed to update employee license. Please try again.",
    //         "error"
    //       );
    //     });
    // } else {
    //   // Send a POST request to the API
    //   httpClient
    //     .post(api, employeeLicenseData)
    //     .then((res) => {
    //       console.log("Employee License added successfully:", res.data);
    //       showToast("Employee License added successfully!", "success");

    //       getEmployeeLicenses(employeeId);

    //       (
    //         document.getElementById("addEmployeeLicenseForm") as HTMLFormElement
    //       )?.reset();
    //       // Close the modal
    //       (
    //         document.getElementById("add-edit-modal") as HTMLDialogElement
    //       )?.close();
    //     })
    //     .catch((err) => {
    //       console.error("Error adding employee license:", err);
    //       showToast(
    //         "An error happened when trying to add employee license.",
    //         "error"
    //       );
    //     });
    // }
  };

  return (
    <div className="container mx-auto">
      <div className="navbar  bg-base-200 ">
        <div className="flex-1">
          <a href="/dashboard" className="btn pr-1 pl-1 ml-2 btn-ghost text-xl">
            <img
              src={logo}
              alt="AccrediTrack Logo"
              className="w-12 mx-auto hidden dark:block"
            />
            <img
              src={logoDark}
              alt="AccrediTrack Logo"
              className="w-12 mx-auto  block dark:hidden"
            />
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu  menu-horizontal px-1">
            <li className="hidden md:block ">
              <a href="/dashboard">Dashboard</a>
            </li>
            <li className="hidden md:block ">
              <a href="/employees">Employees</a>
            </li>
            <li className="hidden md:block ">
              <a href="/license-types">License Types</a>
            </li>
            <li className="hidden md:block ">
              <form
                className="pt-0 pb-0 pl-0 mx-2 pr-0"
                action={api}
                method="post"
              >
                <button className="btn btn-secondary btn-sm ">go PRO</button>
                <input type="hidden" name="token" value={token} />
              </form>
            </li>

            <li className="">
              <div className="dropdown md:hidden dropdown-end pl-0 pt-0 pr-0 pb-0">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-sm btn-ghost  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />{" "}
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <a href="/dashboard" className="btn btn-ghost">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="/employees" className="btn btn-ghost">
                      Employees
                    </a>
                  </li>
                  <li>
                    <a href="/license-types" className="btn btn-ghost">
                      License Types
                    </a>
                  </li>

                  <li>
                    <Payment />
                  </li>
                </ul>
              </div>
            </li>
            <li className="">
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
      <header className="text-center text-2xl font-bold  py-3"></header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
