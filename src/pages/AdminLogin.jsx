import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

export default function AdminLogin({ setIsAdmin }) {
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/packages/admin/all", {
        headers: { "x-admin-key": adminKey }
      });

      if (res.ok) {
        localStorage.setItem("adminKey", adminKey);
        setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        setError("❌ Invalid admin key");
      }
    } catch (err) {
      setError("❌ Connection error - Make sure backend is running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← الرجوع للرئيسية
      </button>

      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Admin Login</h1>
          <p>Enter your admin key to access dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye Open - Larger
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                // Eye Closed - Larger
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have access? Contact system administrator</p>
        </div>
      </div>
    </div>
  );
}