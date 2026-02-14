import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./AdminFavicon.css";

export default function AdminFavicon() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchFavicon();
  }, []);

  const fetchFavicon = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/site-config`);
      setPreview(res.data.favicon || "");
    } catch (err) {
      console.error("Error fetching favicon:", err);
    }
  };

  const updateFavicon = async () => {
    if (!file && !url) {
      setMsg("Please select a file or enter a URL");
      return;
    }

    setLoading(true);
    setMsg("");

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (url) formData.append("url", url);

    try {
      const res = await axios.post(`${BASE_URL}/admin/site/favicon`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMsg("Favicon updated successfully");
        setPreview(res.data.favicon);
        setFile(null);
        setUrl("");
      } else {
        setMsg("Update failed");
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-favicon-container">
      <h3>Update Site Favicon</h3>

      <label>Upload File:</label>
      <input
        type="file"
        accept="image/png,image/jpeg,image/ico"
        onChange={e => setFile(e.target.files[0])}
      />

      <label>Or Enter URL:</label>
      <input
        type="text"
        placeholder="https://example.com/favicon.png"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />

      <button onClick={updateFavicon} disabled={loading}>
        {loading ? "Updating..." : "Update Favicon"}
      </button>

      {msg && <p className="favicon-msg">{msg}</p>}

      {preview && (
        <div className="favicon-preview">
          <img
            src={
              preview.startsWith("http")
                ? preview
                : `${BASE_URL}/images/${preview}?v=${Date.now()}`
            }
            alt="favicon"
          />
          <span>Current favicon preview</span>
        </div>
      )}
    </div>
  );
}