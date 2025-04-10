import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Employees from "./components/employees/Employees";
import Licenses from "./components/licenses/Licenses";
import EmployeeLicenses from "./components/employee-licenses/EmployeeLicenses";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";


function App() {

  // const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     setAuthToken(getAccessTokenSilently);
  //   }
  // }, [isAuthenticated, getAccessTokenSilently]);



  return (
    <div className="container mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="employees" element={<Employees />} />
            <Route path="licenses" element={<Licenses />} />
            <Route path="employee/:id" element={<EmployeeLicenses />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
