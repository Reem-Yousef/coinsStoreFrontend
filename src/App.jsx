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
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // ✅ تحقق من صلاحية الـ Token من الـ Backend
        const res = await fetch('https://coins-store-backend.vercel.app/api/packages/admin/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          setIsAdmin(true); // ✅ Token صالح
        } else {
          setIsAdmin(false); // ❌ Token منتهي أو غلط
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
        fontSize: '1.2rem',
        fontFamily: 'Cairo, sans-serif'
      }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Home Route - Calculator */}
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
        
        {/* 404 Route - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;