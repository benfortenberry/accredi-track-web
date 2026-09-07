import "./App.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { trackPageview } from "./utils/analytics";

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
import DeleteAccount from "./components/DeleteAccount";
import Privacy from "./components/Privacy";
import HealthCheck from "./components/HealthCheck";
import Settings from "./components/Settings";
import Support from "./components/Support";

// Fires a PostHog pageview on every SPA route change. Must live inside the
// Router so it can use useLocation. No-op when analytics isn't configured.
function PageviewTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
}

function App() {
  return (
    <div className="">
     
        <BrowserRouter>
          <PageviewTracker />
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

               <Route
                path="support"
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* <Route path="/home" element={<Home />} /> */}
            <Route index element={<Home />} />
            {/* Vertical landing pages, e.g. /for/healthcare — same page, tailored copy + SEO */}
            <Route path="/for/:vertical" element={<Home />} />
            <Route path="/health" element={<HealthCheck />} />
            <Route path="/login" element={<LoginPrompt />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
   
    </div>
  );
}

export default App;
