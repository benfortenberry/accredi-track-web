import { Outlet } from "react-router-dom";
import LogoutButton from "./auth0/LogoutButton";
import logo from "../assets/logo_white2.png";
import logoDark from "../assets/logo_black2.png";
// import { GearIcon } from "../utils/SvgIcons";
function Layout() {
  return (
    <div className="container mx-auto">
      <div className="navbar  bg-base-200 ">
        <div className="flex-1">
          <a href="/dashboard" className="btn pr-1 pl-1 ml-2 btn-ghost text-xl">
            <img src={logo} alt="AccrediTrack Logo" className="w-12 mx-auto hidden dark:block" />
            <img src={logoDark} alt="AccrediTrack Logo" className="w-12 mx-auto  block dark:hidden" />
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
            <li className="hidden md:block " >
              <a className="btn btn-secondary mx-2 btn-sm" href="/licenses">
                go PRO
              </a>
            </li>
           
            <li className="">
            <div className="dropdown md:hidden dropdown-end pl-0 pt-0 pr-0 pb-0">
            <div tabIndex={0} role="button" className="btn btn-sm btn-ghost  ">
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
                
                <a href='/dashboard' className="btn btn-ghost">Dashboard</a>
              </li>
              <li>
                
                <a href='/employees' className="btn btn-ghost">Employees</a>
              </li>
              <li>
                
                <a href='/license-types' className="btn btn-ghost">License Types</a>
              </li>
             
              <li>
              <a className="btn btn-secondary">go PRO</a>
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
