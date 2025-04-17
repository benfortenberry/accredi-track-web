import { Outlet } from "react-router-dom";
import LogoutButton from "./auth0/LogoutButton";
// import { GearIcon } from "../utils/SvgIcons";
function Layout() {
  return (
    <div className="container mx-auto">
      <div className="navbar  bg-base-200 ">
        <div className="flex-1">
          <a href="/dashboard" className="btn btn-ghost text-xl">
            AccrediTrack
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu  menu-horizontal px-1">
            <li>
              <a href="/employees">Employees</a>
            </li>
            <li>
              <a href="/license-types">License Types</a>
            </li>
            <li>
              <a className="btn btn-secondary mx-2 btn-sm" href="/licenses">go PRO</a>
            </li>
            {/* <li>
              <a>
                <GearIcon />
              </a>
            </li> */}
            <li>
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
