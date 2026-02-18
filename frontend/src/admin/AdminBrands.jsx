import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./AdminBrands.css";

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [brandUrl, setBrandUrl] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/brands`);
      const data = res.data.map((b) => ({
        ...b,
        id: b.id || b._id,
      }));
      setBrands(data);
    } catch (err) {
      console.error("Error fetching brands:", err);
      alert("Failed to fetch brands from server.");
    }
  };

  const resetForm = () => {
    setName("");
    setImageUrl("");
    setFile(null);
    setEditId(null);
    setBrandUrl("");
  };

  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  const addOrEditBrand = async () => {
    if (!name.trim()) {
      alert("Brand name required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("url", formatUrl(brandUrl));

      if (file) formData.append("imageFile", file);
      else if (imageUrl) formData.append("image", imageUrl);

      if (editId) {
        await axios.put(`${BASE_URL}/admin/brands/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${BASE_URL}/admin/brands`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchBrands();
    } catch (err) {
      console.error("Brand save failed", err);
      alert("Brand save failed, check console");
    }
  };

  const editBrand = (brand) => {
    setEditId(brand.id);
    setName(brand.name || "");
    setImageUrl(brand.image || "");
    setBrandUrl(brand.url || "");
    setFile(null);
  };

  const deleteBrand = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/brands/${id}`);
      fetchBrands();
    } catch (err) {
      console.error("Brand delete failed", err);
      alert("Failed to delete brand.");
    }
  };

  return (
    <div className="admin-brands">
      <h2>{editId ? "Edit Brand" : "Add Brand"}</h2>

      <div className="add-brand">
        <input
          type="text"
          placeholder="Brand Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Brand Website URL (example.com)"
          value={brandUrl}
          onChange={(e) => setBrandUrl(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={addOrEditBrand}>
          {editId ? "Update Brand" : "Add Brand"}
        </button>

        {editId && (
          <button className="cancel-btn" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <ul className="brand-list">
        {brands.length > 0 ? (
          brands.map((b) => {
            const website = formatUrl(b.url);

            return (
              <li key={b.id} className="brand-item">
                {b.image && website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={b.image}
                      alt={b.name}
                      className="brand-thumb"
                    />
                    <span>{b.name}</span>
                  </a>
                ) : (
                  <>
                    {b.image && (
                      <img
                        src={b.image}
                        alt={b.name}
                        className="brand-thumb"
                      />
                    )}
                    <span>{b.name}</span>
                  </>
                )}

                <div className="brand-actions">
                  <button onClick={() => editBrand(b)}>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteBrand(b.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <li>No brands available</li>
        )}
      </ul>
    </div>
  );
}