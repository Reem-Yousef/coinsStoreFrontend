// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { apiCall } from "../utils/api";

export default function ProtectedRoute({ requiredRole = "admin" }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        // استخدمنا apiCall اللي يضيف Authorization تلقائيًا لو فيه accessToken
        const res = await apiCall("/auth/me", { method: "GET" });

        if (!res.ok) {
          setAllowed(false);
          setLoading(false);
          return;
        }

        const data = await res.json();
        // التحقق من دور المستخدم
        setAllowed(data.user?.role === requiredRole);
      } catch (err) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, [requiredRole]);

  if (loading) return null;
  return allowed ? <Outlet /> : <Navigate to="/" replace />;
}
