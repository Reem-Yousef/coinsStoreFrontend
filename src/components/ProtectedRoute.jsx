// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ requiredRole = "admin" }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const token = localStorage.getItem("token"); // أو جلب من cookie
        if (!token) {
          setAllowed(false);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setAllowed(false);
          setLoading(false);
          return;
        }

        const data = await res.json();
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
