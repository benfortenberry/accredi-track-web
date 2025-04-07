import { useState } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Employees from "./components/Employees";
function App() {
  return (
    <div className="container mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Employees />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
