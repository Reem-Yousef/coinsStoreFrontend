import { useEffect, useState } from 'react';
import { apiCall } from '../../utils/api';

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    type: 'whatsapp',
    label: '',
    url: '',
    icon: '',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await apiCall('/contacts/admin/all');
      const data = await res.json();
      setContacts(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/contacts/${editingId}`
        : '/contacts';

      const method = editingId ? 'PUT' : 'POST';

      const res = await apiCall(url, {
        method,
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchContacts();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (contact) => {
    setFormData(contact);
    setEditingId(contact._id);
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact link?')) return;

    try {
      await apiCall(`/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'whatsapp',
      label: '',
      url: '',
      icon: '',
      isActive: true,
      order: 0
    });
    setEditingId(null);
    setShowAdd(false);
  };

  return (
    <div className="manager-section">
      <div className="section-header">
        <h2>Contact Links Management</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
          {showAdd ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="admin-form">
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="other">Other</option>
          </select>

          <input
            placeholder="Label"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
          />

          <input
            placeholder="URL"
            value={formData.url}
            onChange={(e) =>
              setFormData({ ...formData, url: e.target.value })
            }
          />

          <input
            placeholder="Icon"
            value={formData.icon}
            onChange={(e) =>
              setFormData({ ...formData, icon: e.target.value })
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
            Active
          </label>

          <button className="btn-success">
            {editingId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="items-list">
        {contacts.map((c) => (
          <div key={c._id} className="item-card">
            <h3>{c.icon} {c.label}</h3>
            <p>{c.url}</p>
            <button onClick={() => handleEdit(c)}>Edit</button>
            <button onClick={() => handleDelete(c._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
