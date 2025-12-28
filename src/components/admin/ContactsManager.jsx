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
        <h2>📞 Contact Links Management</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
          {showAdd ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
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
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
            />
          </div>

          <input
            placeholder="Label (e.g. WhatsApp Business)"
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            required
          />

          <input
            placeholder="URL (e.g. https://wa.me/201234567890)"
            value={formData.url}
            onChange={(e) =>
              setFormData({ ...formData, url: e.target.value })
            }
            required
          />

          <input
            placeholder="Icon Emoji (e.g. 📱 or 💬)"
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
            Active Contact
          </label>

          <button type="submit" className="btn-success">
            {editingId ? 'Update Contact' : 'Create Contact'}
          </button>
        </form>
      )}

      <div className="items-list">
        {contacts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '20px' }}>
            No contact links yet. Add your first contact!
          </p>
        ) : (
          contacts.map((contact) => (
            <div key={contact._id} className={`item-card ${!contact.isActive ? 'inactive' : ''}`}>
              <div className="item-info">
                <h3>
                  {contact.icon} {contact.label}
                </h3>
                <p className="url-preview">
                  <strong>Type:</strong> {contact.type}
                </p>
                <p className="url-preview">
                  {contact.url}
                </p>
                <span className={`badge ${contact.isActive ? 'active' : 'inactive'}`}>
                  {contact.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(contact)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(contact._id)} className="btn-delete">
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