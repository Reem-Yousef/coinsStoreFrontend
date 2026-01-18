import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from "./components/ProtectedRoute"; // استيراد المكوّن من ملف مستقل

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // تحقق من الـ Token عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // تحقق من صلاحية الـ Token من الـ Backend (غالبًا endpoint محمي)
        const res = await fetch('https://coins-store-backend.vercel.app/api/packages/admin/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          setIsAdmin(true); // Token صالح
        } else {
          setIsAdmin(false); // Token غير صالح
          localStorage.removeItem('accessToken');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAdmin(false);
        localStorage.removeItem('accessToken');
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Loading state أثناء التحقق
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0000, #2d0000)',
        color: 'white',
        fontSize: '1.2rem',
        fontFamily: 'Cairo, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div>جاري التحميل...</div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Login - لو مصادق سيتم تحويله للداشبورد */}
        <Route
          path="/admin/login"
          element={
            isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin setIsAdmin={setIsAdmin} />
          }
        />

        {/* Admin Dashboard - محمي */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={isAdmin}>
              <AdminDashboard setIsAdmin={setIsAdmin} />
            </ProtectedRoute>
          }
        />

        {/* 404 -> Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
