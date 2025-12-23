import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PackagesManager from "../components/admin/PackagesManager";
import ContactsManager from "../components/admin/ContactsManager";
import "../styles/admin.css";

export default function AdminDashboard({ setIsAdmin }) {
  const [activeTab, setActiveTab] = useState("packages");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminKey");
    setIsAdmin(false);
    navigate("/admin/login");
  };

  return (
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
  );
}