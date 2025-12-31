// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import HomePage from "./pages/HomePage";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminLogin from "./pages/AdminLogin";
// import "./styles.css";

// function App() {
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const adminKey = localStorage.getItem('adminKey');
//     setIsAdmin(!!adminKey);
//   }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
//         <Route 
//           path="/admin/dashboard" 
//           element={isAdmin ? <AdminDashboard setIsAdmin={setIsAdmin} /> : <Navigate to="/admin/login" />} 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Calculator from './components/Calculator';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// ✅ Protected Route Component
function ProtectedRoute({ isAdmin, children }) {
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ تحقق من الـ Token عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // ✅ لو فيه token، يبقى Admin
        setIsAdmin(true);
      } else {
        // ❌ لو مفيش token، مش Admin
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ Loading state أثناء التحقق
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0000, #2d0000)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Calculator />} />

        {/* Admin Login Route */}
        <Route 
          path="/admin/login" 
          element={
            isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin setIsAdmin={setIsAdmin} />
            )
          } 
        />

        {/* Admin Dashboard Route - Protected */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute isAdmin={isAdmin}>
              <AdminDashboard setIsAdmin={setIsAdmin} />
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;