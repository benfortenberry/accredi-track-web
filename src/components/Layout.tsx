import { Outlet } from "react-router-dom";
import LogoutButton from "./auth0/LogoutButton";

import logo from "../assets/logo_white2.png";
import logoDark from "../assets/logo_black2.png";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";
import { GearIcon } from "../utils/SvgIcons";
import { getApiBaseUrl } from "../utils/config";
function Layout() {
  const API_BASE_URL = getApiBaseUrl();
  const api = `${API_BASE_URL}/create-checkout-session`;
  const { user } = useAuth0();
  const { aUser } = useUser();

  const email = user?.email || aUser?.email || "";

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navbar rounded-box mt-3 bg-base-200/90 shadow-sm">
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
                <a href="/dashboard">Dashboard </a>
              </li>
              <li className="hidden md:block ">
                <a href="/employees">Employees</a>
              </li>
              <li className="hidden md:block ">
                <a href="/license-types">Licenses</a>
              </li>

              {aUser && aUser.pro != 1 && (
                <li className="hidden md:block ">
                  <form
                    className="pt-0 pb-0 pl-0 mx-2 pr-0"
                    action={api}
                    method="post"
                  >
                    <button className="btn btn-secondary btn-sm ">go PRO</button>
                    <input type="hidden" name="email" value={email} />
                  </form>
                </li>
              )}
              <li className="hidden md:block ">
                <a href="/settings" title="Settings">
                  <GearIcon />
                </a>
              </li>

              <li className="hidden md:block ">
                <a href="/support" title="Support">
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
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>
                </a>
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

                    <li >
                      <a href="/support" className="btn btn-ghost" title="Support">

                        Support


                      </a>
                    </li>

                    {aUser && aUser.pro != 1 && (
                      <form
                        className="pt-0 pb-0 pl-0 mx-2 pr-0"
                        action={api}
                        method="post"
                      >
                        <button className="btn btn-sm btn-secondary w-full ">
                          go PRO
                        </button>
                        <input type="hidden" name="email" value={email} />
                      </form>
                    )}
                  </ul>
                </div>
              </li>
              <li className="">
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
        <header className="text-center text-2xl font-bold py-3"></header>
        <main className="pb-8 pt-2">
          <div className="rounded-box border border-base-content/10 bg-base-100 p-3 sm:p-6 lg:p-8 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
