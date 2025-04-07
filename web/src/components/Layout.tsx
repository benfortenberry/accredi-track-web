import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="container-fluid mx-auto">
      <header className="text-center py-3">
        <h1>
          &nbsp;AccrediTrack
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;