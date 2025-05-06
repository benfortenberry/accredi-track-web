import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Layout from "./components/Layout";
import Employees from "./components/employees/Employees";
import Licenses from "./components/licenses/Licenses";
import EmployeeLicenses from "./components/employee-licenses/EmployeeLicenses";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import ComingSoon from "./components/ComingSoon";
import ProtectedRoute from "./components/auth0/ProtectedRoute";
import NotFound from "./components/NotFound";
import LoginPrompt from "./components/LoginPrompt";
import Terms from "./components/Terms";
import DeleteAccount from "./components/DeleteAccount";
import Privacy from "./components/Privacy";
import HealthCheck from "./components/HealthCheck";
import Settings from "./components/Settings";

function App() {
  return (
    <div className="">
      <UserProvider>
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
                path="license-types"
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

              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* <Route path="/home" element={<Home />} /> */}
            <Route index element={<Home />} />
            <Route path="/health" element={<HealthCheck />} />
            <Route path="/login" element={<LoginPrompt />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
