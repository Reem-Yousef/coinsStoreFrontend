import { useState, useEffect } from "react";

const API = "https://coins-store-backend.vercel.app/api/packages";
const getAdminKey = () => localStorage.getItem("adminKey");

export default function PackagesManager() {
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    minCoins: "",
    maxCoins: "",
    pricePerK: "",
    title: "",
    description: "",
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch(`${API}/admin/all`, {
        headers: { "x-admin-key": getAdminKey() }
      });
      const data = await res.json();
      setPackages(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": getAdminKey()
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchPackages();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (pkg) => {
    setFormData(pkg);
    setEditingId(pkg._id);
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this package?")) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": getAdminKey() }
      });
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      minCoins: "",
      maxCoins: "",
      pricePerK: "",
      title: "",
      description: "",
      isActive: true,
      order: 0
    });
    setEditingId(null);
    setShowAdd(false);
  };

  return (
    <div className="manager-section">
      <div className="section-header">
        <h2>Pricing Packages Management</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
          {showAdd ? "Cancel" : "+ Add Package"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <input
              type="number"
              placeholder="Min Coins"
              value={formData.minCoins}
              onChange={(e) => setFormData({ ...formData, minCoins: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Max Coins"
              value={formData.maxCoins}
              onChange={(e) => setFormData({ ...formData, maxCoins: e.target.value })}
              required
            />
          </div>

          <input
            type="number"
            step="0.01"
            placeholder="Price per 1000 coins (EGP)"
            value={formData.pricePerK}
            onChange={(e) => setFormData({ ...formData, pricePerK: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="form-row">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
            <input
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-success">
            {editingId ? "Update" : "Create"} Package
          </button>
        </form>
      )}

      <div className="items-list">
        {packages.map(pkg => (
          <div key={pkg._id} className={`item-card ${!pkg.isActive ? 'inactive' : ''}`}>
            <div className="item-info">
              <h3>{pkg.title}</h3>
              <p>Coins: {pkg.minCoins} - {pkg.maxCoins}</p>
              <p>Price: {pkg.pricePerK} EGP per 1000</p>
              <span className={`badge ${pkg.isActive ? 'active' : 'inactive'}`}>
                {pkg.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="item-actions">
              <button onClick={() => handleEdit(pkg)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(pkg._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}