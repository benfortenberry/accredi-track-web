import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Employees from "./components/employees/Employees";
import Licenses from "./components/licenses/Licenses";
import EmployeeLicenses from "./components/employee-licenses/EmployeeLicenses";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import ProtectedRoute from "./components/auth0/ProtectedRoute";
import NotFound from "./components/NotFound";
import LoginPrompt from "./components/LoginPrompt";
import Terms from "./components/Terms";
import HealthCheck from "./components/HealthCheck";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="licenses"
              element={
                <ProtectedRoute>
                  <Licenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="employee/:id"
              element={
                <ProtectedRoute>
                  <EmployeeLicenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route index element={<Home />} />
          <Route path="/health" element={<HealthCheck />} />
          <Route path="/login" element={<LoginPrompt />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
