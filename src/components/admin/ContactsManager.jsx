import { useState, useEffect } from "react";

const API = "http://localhost:5000/api/contacts";
const getAdminKey = () => localStorage.getItem("adminKey");

export default function ContactsManager() {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [formData, setFormData] = useState({
    type: "whatsapp",
    label: "",
    url: "",
    icon: "",
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API}/admin/all`, {
        headers: { "x-admin-key": getAdminKey() }
      });
      const data = await res.json();
      setContacts(data.data || []);
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
    if (!confirm("Delete this contact link?")) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": getAdminKey() }
      });
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "whatsapp",
      label: "",
      url: "",
      icon: "",
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
          {showAdd ? "Cancel" : "+ Add Contact"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="admin-form">
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Label (e.g., واتساب الدعم)"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
          />

          <input
            type="url"
            placeholder="URL (e.g., https://wa.me/...)"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Icon (emoji or text)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
            {editingId ? "Update" : "Create"} Contact
          </button>
        </form>
      )}

      <div className="items-list">
        {contacts.map(contact => (
          <div key={contact._id} className={`item-card ${!contact.isActive ? 'inactive' : ''}`}>
            <div className="item-info">
              <h3>{contact.icon} {contact.label}</h3>
              <p>Type: {contact.type}</p>
              <p className="url-preview">{contact.url}</p>
              <span className={`badge ${contact.isActive ? 'active' : 'inactive'}`}>
                {contact.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="item-actions">
              <button onClick={() => handleEdit(contact)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(contact._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}