import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "../utils/api";
import PackagesManager from "../components/admin/PackagesManager";
import ContactsManager from "../components/admin/ContactsManager";
import useDocumentMeta from '../hooks/useDocumentMeta';
import "../styles/admin.css";

export default function AdminDashboard({ setIsAdmin }) {

    useDocumentMeta({
      title: 'Admin Dashboard – 3Fret',
      description: 'صفحة إدارة المتجر - محمية ولا تُفهرس',
      robots: 'noindex, nofollow'
    });
    
  const [activeTab, setActiveTab] = useState("packages");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // ✅ اطلب logout من السيرفر
      await fetch("https://coins-store-backend.vercel.app/api/auth/logout", {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    // ✅ امسح الـ Token المحلي
    clearAccessToken();
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