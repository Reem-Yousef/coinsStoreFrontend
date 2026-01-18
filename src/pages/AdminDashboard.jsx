import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "../utils/api";
import PackagesManager from "../components/admin/PackagesManager";
import ContactsManager from "../components/admin/ContactsManager";
import "../styles/admin.css";
import { Helmet } from "react-helmet-async";

export default function AdminDashboard({ setIsAdmin }) {
  const [activeTab, setActiveTab] = useState("packages");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("https://coins-store-backend.vercel.app/api/auth/logout", {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    clearAccessToken();
    setIsAdmin(false);
    navigate("/admin/login");
  };

  return (
    <>
      {/* Helmet داخل الـ render */} 
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin Dashboard – 3Fret</title>
      </Helmet>

      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>⚙️ Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </header>

        <div className="admin-tabs">
          <button
            className={activeTab === "packages" ? "active" : ""}
            onClick={() => setActiveTab("packages")}
          >
            📦 Pricing Packages
          </button>
          <button
            className={activeTab === "contacts" ? "active" : ""}
            onClick={() => setActiveTab("contacts")}
          >
            📞 Contact Links
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "packages" && <PackagesManager />}
          {activeTab === "contacts" && <ContactsManager />}
        </div>
      </div>
    </>
  );
}
