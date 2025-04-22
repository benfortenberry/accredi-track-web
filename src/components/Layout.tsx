import { Outlet } from "react-router-dom";
import LogoutButton from "./auth0/LogoutButton";
import logo from "../assets/logo_white2.png";
import logoDark from "../assets/logo_black2.png";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { GearIcon } from "../utils/SvgIcons";

// import { GearIcon } from "../utils/SvgIcons";
function Layout() {
  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
  const api = `${API_BASE_URL}/create-checkout-session`;
  const { getAccessTokenSilently } = useAuth0();

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    getToken();
    // getUser();
  }, []);


  const getToken= async () => {
    let accessToken = await getAccessTokenSilently();
    setToken(accessToken);
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
              <form
                className="pt-0 pb-0 pl-0 mx-2 pr-0"
                action={api}
                method="post"
              >
                <button className="btn btn-secondary btn-sm ">go PRO</button>
                <input type="hidden" name="token" value={token} />
              </form>
            </li>
            <li className="hidden md:block ">
              <a href="/settings"><GearIcon /></a>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
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
                    <a href="/settings" className="btn btn-ghost">
                     Settings
                    </a>
                  </li>

                 
                    <form
                      className="pt-0 pb-0 pl-0 mx-2 pr-0"
                      action={api}
                      method="post"
                    >
                      <button className="btn btn-sm btn-secondary w-full ">
                        go PRO
                      </button>
                      <input type="hidden" name="token" value={token} />
                    </form>
                 
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
