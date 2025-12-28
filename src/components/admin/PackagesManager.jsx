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
      <h2>Packages Management</h2>

      <button onClick={() => setShowAdd(!showAdd)}>
        {showAdd ? 'Cancel' : '+ Add Package'}
      </button>

      {showAdd && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Min Coins"
            value={formData.minCoins}
            onChange={(e) =>
              setFormData({ ...formData, minCoins: e.target.value })
            }
          />

          <input
            placeholder="Max Coins"
            value={formData.maxCoins}
            onChange={(e) =>
              setFormData({ ...formData, maxCoins: e.target.value })
            }
          />

          <input
            placeholder="Price per 1000"
            value={formData.pricePerK}
            onChange={(e) =>
              setFormData({ ...formData, pricePerK: e.target.value })
            }
          />

          <input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button>{editingId ? 'Update' : 'Create'}</button>
        </form>
      )}

      {packages.map((p) => (
        <div key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.minCoins} → {p.maxCoins}</p>
          <button onClick={() => handleEdit(p)}>Edit</button>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
