import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Employees from "./components/admin/employees/Employees";
import Licenses from "./components/admin/licenses/Licenses";
import Dashboard from "./components/Dashboard";
function App() {
  return (
    <div className="container mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="employees" element={<Employees />} />
            <Route path="licenses" element={<Licenses />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
