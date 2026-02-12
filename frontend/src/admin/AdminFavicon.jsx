import { useState, useEffect } from "react";
import "./AdminFavicon.css";

export default function AdminFavicon() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/site-config")
      .then(res => res.json())
      .then(data => setPreview(data.favicon || ""));
  }, []);

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
      const res = await fetch("http://localhost:5000/admin/site/favicon", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        setMsg(" Favicon updated successfully");
        setPreview(data.favicon);
        setFile(null);
        setUrl("");
      } else {
        setMsg("Update failed");
      }
    } catch (err) {
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

      {msg && <p>{msg}</p>}

      {preview && (
        <div className="favicon-preview">
          <img
            src={
              preview.startsWith("http")
                ? preview
                : `http://localhost:5000/images/${preview}?v=${Date.now()}`
            }
            alt="favicon"
          />
          <span>Current favicon preview</span>
        </div>
      )}
    </div>
  );
}
