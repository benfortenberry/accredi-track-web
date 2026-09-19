import { Outlet, useLocation, Link } from "react-router-dom";
import LogoutButton from "./auth0/LogoutButton";

import { useUser } from "../context/UserContext";
import { MenuIcon } from "../utils/SvgIcons";
import { useGoPro } from "../utils/useGoPro";

function Layout() {
  const { aUser } = useUser();
  const { pathname } = useLocation();

  // Shared checkout kickoff (see useGoPro): goes through httpClient so the
  // Auth0 Bearer token is attached, and navigates the browser to the returned
  // Stripe URL.
  const goPro = useGoPro();

  // Desktop horizontal nav: signal active with a colored bottom border (+ text
  // color), NOT font-weight. Bold text is wider than regular, so toggling weight
  // reflowed the nav and shifted neighbouring links on every navigation. The
  // border is always present but transparent when inactive, so it reserves its
  // space in both states and never causes layout shift.
  const navLinkClass = (path: string) =>
    pathname === path
      ? "border-b-2 border-primary  rounded-none"
      : "border-b-2 border-transparent";

  // Mobile dropdown: vertical stack of full-width buttons, so there's no reflow
  // concern. A background highlight (primary tint + text) is the clearer active
  // cue here than an underline.
  const mobileNavLinkClass = (path: string) =>
    pathname === path ? "bg-primary/10 text-primary" : "";

  // daisyUI's dropdown stays open while its content holds focus. On mobile,
  // clicking a link navigates via the SPA router (no page reload) so focus stays
  // inside the menu and it stays open over the new page. Blurring the active
  // element drops focus and collapses the dropdown after a tap.
  const closeMobileMenu = () => {
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navbar rounded-box mt-3 bg-base-200/90 shadow-sm">
          <div className="flex-1">
            <Link to="/dashboard" className="btn pr-1 pl-1 ml-2 btn-ghost text-xl">
              <img
                src="/cropped-logo-transparent.png"
                alt="AccrediTrack"
                className="w-12 mx-auto"
              />
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li className="hidden md:block">
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>Dashboard</Link>
              </li>
              <li className="hidden md:block">
                <Link to="/employees" className={navLinkClass("/employees")}>Employees</Link>
              </li>
              <li className="hidden md:block">
                <Link to="/credentials" className={navLinkClass("/credentials")}>Credentials</Link>
              </li>
              <li className="hidden md:block">
                <Link to="/license-types" className={navLinkClass("/license-types")}>License Types</Link>
              </li>

              {aUser && aUser.pro != 1 && (
                <li className="hidden md:block">
                  <button
                    className="btn btn-secondary btn-sm mx-2"
                    onClick={goPro}
                  >
                    go PRO
                  </button>
                </li>
              )}
              <li className="hidden md:block">
                <Link to="/settings" className={navLinkClass("/settings")}>Settings</Link>
              </li>
              <li className="hidden md:block">
                <Link to="/help" className={navLinkClass("/help")}>Support</Link>
              </li>

              {/* Mobile hamburger */}
              <li className="">
                <div className="dropdown md:hidden dropdown-end pl-0 pt-0 pr-0 pb-0">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-sm btn-ghost"
                    aria-label="Open menu"
                  >
                    <MenuIcon />
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link to="/dashboard" onClick={closeMobileMenu} className={`btn btn-ghost ${mobileNavLinkClass("/dashboard")}`}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/employees" onClick={closeMobileMenu} className={`btn btn-ghost ${mobileNavLinkClass("/employees")}`}>
                        Employees
                      </Link>
                    </li>
                    <li>
                      <Link to="/credentials" onClick={closeMobileMenu} className={`btn btn-ghost ${mobileNavLinkClass("/credentials")}`}>
                        Credentials
                      </Link>
                    </li>
                    <li>
                      <Link to="/license-types" onClick={closeMobileMenu} className={`btn btn-ghost ${mobileNavLinkClass("/license-types")}`}>
                        License Types
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={closeMobileMenu} className={`btn btn-ghost ${mobileNavLinkClass("/settings")}`}>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/help" onClick={closeMobileMenu} className={`btn btn-ghost ${mobileNavLinkClass("/help")}`}>
                        Support
                      </Link>
                    </li>

                    {aUser && aUser.pro != 1 && (
                      <li>
                        <button
                          className="btn btn-sm btn-secondary w-full"
                          onClick={() => {
                            closeMobileMenu();
                            goPro();
                          }}
                        >
                          go PRO
                        </button>
                      </li>
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
        <main className="pb-8 pt-2">
          <div className="rounded-box border border-base-content/10 bg-base-100 p-3 sm:p-6 lg:p-8 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>

      {/* App-wide toast target. Hosted once here so showToast works on every
          authenticated page (Dashboard, Settings, Support) and on Layout's own
          actions (e.g. a failed goPro checkout) — previously it lived inline on
          only a few pages, so toasts silently vanished elsewhere. */}
      <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>
    </div>
  );
}

export default Layout;
