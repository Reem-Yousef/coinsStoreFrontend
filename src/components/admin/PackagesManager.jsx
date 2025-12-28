import { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';

export default function PackagesManager() {
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    minCoins: '',
    maxCoins: '',
    pricePerK: '',
    title: '',
    description: '',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await apiCall('/packages/admin/all');
      const data = await res.json();
      setPackages(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/packages/${editingId}`
        : '/packages';

      const method = editingId ? 'PUT' : 'POST';

      const res = await apiCall(url, {
        method,
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
    if (!confirm('Delete this package?')) return;

    try {
      await apiCall(`/packages/${id}`, { method: 'DELETE' });
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      minCoins: '',
      maxCoins: '',
      pricePerK: '',
      title: '',
      description: '',
      isActive: true,
      order: 0
    });
    setEditingId(null);
    setShowAdd(false);
  };

  return (
    <div className="manager-section">
      <div className="section-header">
        <h2>📦 Packages Management</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
          {showAdd ? 'Cancel' : '+ Add Package'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <input
              type="number"
              placeholder="Min Coins"
              value={formData.minCoins}
              onChange={(e) =>
                setFormData({ ...formData, minCoins: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Max Coins"
              value={formData.maxCoins}
              onChange={(e) =>
                setFormData({ ...formData, maxCoins: e.target.value })
              }
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              step="0.01"
              placeholder="Price per 1000 coins"
              value={formData.pricePerK}
              onChange={(e) =>
                setFormData({ ...formData, pricePerK: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
            />
          </div>

          <input
            placeholder="Package Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <label>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            Active Package
          </label>

          <button type="submit" className="btn-success">
            {editingId ? 'Update Package' : 'Create Package'}
          </button>
        </form>
      )}

      <div className="items-list">
        {packages.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '20px' }}>
            No packages yet. Add your first package!
          </p>
        ) : (
          packages.map((pkg) => (
            <div key={pkg._id} className={`item-card ${!pkg.isActive ? 'inactive' : ''}`}>
              <div className="item-info">
                <h3>{pkg.title}</h3>
                <p>
                  <strong>Range:</strong> {pkg.minCoins.toLocaleString()} → {pkg.maxCoins.toLocaleString()} coins
                </p>
                <p>
                  <strong>Price:</strong> {pkg.pricePerK} EGP per 1000 coins
                </p>
                {pkg.description && <p>{pkg.description}</p>}
                <span className={`badge ${pkg.isActive ? 'active' : 'inactive'}`}>
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(pkg)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(pkg._id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}