import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="">
      <header className="text-center text-2xl font-bold  py-3">
        <h1>&nbsp;AccrediTrack</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
