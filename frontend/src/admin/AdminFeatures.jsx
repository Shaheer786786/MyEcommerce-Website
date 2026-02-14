import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./AdminFeatures.css";

export default function AdminFeatures() {
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({ icon: "", title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/features`);
      setFeatures(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching features:", err);
      setFeatures([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/admin/features/${editingId}`, form);
        setMessage("Feature updated!");
      } else {
        await axios.post(`${BASE_URL}/admin/features`, form);
        setMessage("Feature added!");
      }

      setForm({ icon: "", title: "", description: "" });
      setEditingId(null);
      fetchFeatures();
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error(err);
      alert("Error saving feature");
    }
  };

  const handleEdit = (f) => {
    setForm({ icon: f.icon, title: f.title, description: f.description });
    setEditingId(f.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/admin/features/${id}`);
    setMessage("Feature deleted!");
    fetchFeatures();
    setTimeout(() => setMessage(null), 2000);
  };

  const handleRecover = async (id) => {
    await axios.put(`${BASE_URL}/admin/features/recover/${id}`);
    setMessage("Feature recovered!");
    fetchFeatures();
    setTimeout(() => setMessage(null), 2000);
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Permanently delete this feature?")) return;
    await axios.delete(`${BASE_URL}/admin/features/permanent/${id}`);
    setMessage("Feature permanently deleted!");
    fetchFeatures();
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="admin-page">
      <h2>Admin Features</h2>

      {message && <div className="af-message">{message}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          name="icon"
          placeholder="Icon (emoji or URL)"
          value={form.icon}
          onChange={handleChange}
        />
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? "Update Feature" : "Add Feature"}
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.length ? (
            features.map((f) => (
              <tr key={f.id}>
                <td>
                  {f.icon?.startsWith("http") ? (
                    <img src={f.icon} alt={f.title} className="feature-icon-img" />
                  ) : (
                    <span className="feature-icon-text">{f.icon}</span>
                  )}
                </td>
                <td>{f.title}</td>
                <td>{f.description}</td>
                <td>
                  {!f.deleted ? (
                    <>
                      <button onClick={() => handleEdit(f)}>Edit</button>
                      <button onClick={() => handleDelete(f.id)}>Delete</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleRecover(f.id)}>Recover</button>
                      <button onClick={() => handlePermanentDelete(f.id)}>
                        Permanent
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No features added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}