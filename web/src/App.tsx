import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Employees from "./components/admin/employees/Employees";
import LicenseTypes from "./components/admin/license-types/LicenseTypes";
function App() {
  return (
    <div className="container mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="employees" element={<Employees />} />
            <Route path="license-types" element={<LicenseTypes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
