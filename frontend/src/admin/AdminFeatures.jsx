import { useEffect, useState } from "react";
import "./AdminFeatures.css";

function AdminFeatures() {
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({ icon: "", title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchFeatures = async () => {
    const res = await fetch("http://127.0.0.1:5000/admin/features");
    const data = await res.json();
    setFeatures(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://127.0.0.1:5000/admin/features/${editingId}`
      : "http://127.0.0.1:5000/admin/features";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Error saving feature");
      return;
    }

    setMessage(editingId ? "Feature updated!" : "Feature added!");
    setForm({ icon: "", title: "", description: "" });
    setEditingId(null);
    fetchFeatures();
    setTimeout(() => setMessage(null), 2000);
  };

  const handleEdit = (f) => {
    setForm({ icon: f.icon, title: f.title, description: f.description });
    setEditingId(f.id);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://127.0.0.1:5000/admin/features/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("Feature deleted!");
      fetchFeatures();
    }
  };

  const handleRecover = async (id) => {
    const res = await fetch(`http://127.0.0.1:5000/admin/features/recover/${id}`, {
      method: "PUT",
    });
    if (res.ok) {
      setMessage("Feature recovered!");
      fetchFeatures();
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Permanently delete this feature?")) return;
    const res = await fetch(`http://127.0.0.1:5000/admin/features/permanent/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMessage("Feature permanently deleted!");
      fetchFeatures();
    }
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
                    <img
                      src={f.icon}
                      alt={f.title}
                      className="feature-icon-img"
                    />
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

export default AdminFeatures;
