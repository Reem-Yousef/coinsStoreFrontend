import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import "./styles.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminKey = localStorage.getItem('adminKey');
    setIsAdmin(!!adminKey);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route 
          path="/admin/dashboard" 
          element={isAdmin ? <AdminDashboard setIsAdmin={setIsAdmin} /> : <Navigate to="/admin/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;