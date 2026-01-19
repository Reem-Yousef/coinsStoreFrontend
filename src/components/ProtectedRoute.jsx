// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { apiCall } from "../utils/api";

export default function ProtectedRoute({ requiredRole = "admin", children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        // apiCall يضيف Authorization تلقائياً إن كان موجود
        const res = await apiCall("/auth/me", { method: "GET" });
        if (!mounted) return;
        if (!res.ok) {
          setAllowed(false);
          return;
        }
        const data = await res.json();
        setAllowed(data.user?.role === requiredRole);
      } catch (err) {
        if (!mounted) return;
        setAllowed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    check();
    return () => { mounted = false; };
  }, [requiredRole]);

  if (loading) return null; // أو لودر صغير لو حابة

  if (!allowed) {
    return <Navigate to="/admin/login" replace />;
  }

  // يدعم الاستخدام كـ Wrapper أو كمكفوف بـ Outlet
  return children ? children : <Outlet />;
}
