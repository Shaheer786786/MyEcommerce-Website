import React, { useEffect, useState } from "react";
import "./AdminFooter.css";

const emptyFooter = {
  headings: { about: "ABOUT US", support: "CUSTOMER SUPPORT", extra: "MORE", connect: "CONNECT WITH US" },
  columns: { about: [], support: [], extra: [], connect: [] },  
  social: {},
  newsletter: { text: "", button: "" },
  footerBottom: { copyright: "" }
};

function AdminFooter() {
  const [footer, setFooter] = useState(emptyFooter);
  const [loading, setLoading] = useState(false);
  const [newHeadingKey, setNewHeadingKey] = useState("");
  const [toasts, setToasts] = useState([]); 

  const loadFooter = () => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/footer")
      .then(res => res.json())
      .then(data => setFooter({ ...emptyFooter, ...data }))
      .catch(err => { console.error(err); setFooter(emptyFooter); })
      .finally(() => setLoading(false));
  };

  useEffect(loadFooter, []);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000); 
  };

  const saveFooter = () => {
    fetch("http://127.0.0.1:5000/admin/footer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(footer)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save footer");
        return res.json();
      })
      .then(() => showToast("Footer updated successfully!", "success"))
      .catch(err => showToast("Error: " + err.message, "error"));
  };

  const handleHeading = (key, value) => setFooter(prev => ({
    ...prev,
    headings: { ...prev.headings, [key]: value }
  }));

  const addHeading = () => {
    const key = newHeadingKey.trim().toLowerCase().replace(/\s+/g, "-");
    if (!key || footer.headings[key]) return;
    setFooter(prev => ({
      ...prev,
      headings: { ...prev.headings, [key]: newHeadingKey },
      columns: { ...prev.columns, [key]: [] }
    }));
    showToast(`Heading "${newHeadingKey}" added!`);
    setNewHeadingKey("");
  };

  const deleteHeading = key => {
    setFooter(prev => {
      const newHeadings = { ...prev.headings }; delete newHeadings[key];
      const newColumns = { ...prev.columns }; delete newColumns[key];
      showToast(`Heading "${key}" deleted`);
      return { ...prev, headings: newHeadings, columns: newColumns };
    });
  };

  const handleColumn = (col, idx, key, value) => {
    setFooter(prev => {
      const newCol = [...prev.columns[col]];
      newCol[idx][key] = value;
      return { ...prev, columns: { ...prev.columns, [col]: newCol } };
    });
  };

  const addColumnItem = col => {
    setFooter(prev => ({
      ...prev,
      columns: { ...prev.columns, [col]: [...prev.columns[col], { text: "", url: "" }] }
    }));
    showToast(`Item added to "${col}"`);
  };

  const removeColumnItem = (col, idx) => {
    setFooter(prev => ({
      ...prev,
      columns: { ...prev.columns, [col]: prev.columns[col].filter((_, i) => i !== idx) }
    }));
    showToast(`Item removed from "${col}"`);
  };

  const handleSocial = (platform, key, value) => setFooter(prev => ({
    ...prev,
    social: { ...prev.social, [platform]: { ...prev.social[platform], [key]: value } }
  }));

  const addSocial = platform => {
    const key = platform.trim().toLowerCase().replace(/\s+/g, "-");
    if (!key || footer.social[key]) return;
    setFooter(prev => ({
      ...prev,
      social: { ...prev.social, [key]: { name: platform, url: "" } }
    }));
    showToast(`Social platform "${platform}" added!`);
    setNewHeadingKey("");
  };

  const removeSocial = platform => {
    setFooter(prev => {
      const newSocial = { ...prev.social }; delete newSocial[platform];
      showToast(`Social platform removed`);
      return { ...prev, social: newSocial };
    });
  };

  const handleNewsletter = (key, value) => setFooter(prev => ({
    ...prev, newsletter: { ...prev.newsletter, [key]: value }
  }));

  const handleFooterBottom = value => setFooter(prev => ({
    ...prev, footerBottom: { ...prev.footerBottom, copyright: value }
  }));

  return (
    <div className="admin-footer-page">
      <h2>Admin Footer Manager</h2>
      {loading && <small>Loading footer...</small>}

      <div className="admin-card">

        <h3>Headings</h3>
        <div className="add-heading">
          <input
            placeholder="New heading name"
            value={newHeadingKey}
            onChange={e => setNewHeadingKey(e.target.value)}
          />
          <button className="add-btn" onClick={addHeading}>+ Add Heading</button>
        </div>

        {Object.keys(footer.headings).map(h => (
          <div key={h} className="heading-item">
            <input
              placeholder="Heading text"
              value={footer.headings[h]}
              onChange={e => handleHeading(h, e.target.value)}
            />
            <button className="delete-btn" onClick={() => deleteHeading(h)}>Delete</button>
          </div>
        ))}

        <h3>Columns</h3>
        {Object.keys(footer.columns)
          .filter(col => footer.headings.hasOwnProperty(col))
          .map(col => (
            <div key={col} className="column-section">
              <h4>{footer.headings[col] || col}</h4>
              {footer.columns[col].map((item, idx) => (
                <div key={idx} className="column-item">
                  <input
                    placeholder="Text"
                    value={item.text}
                    onChange={e => handleColumn(col, idx, "text", e.target.value)}
                  />
                  <input
                    placeholder="URL"
                    value={item.url}
                    onChange={e => handleColumn(col, idx, "url", e.target.value)}
                  />
                  <button className="delete-btn" onClick={() => removeColumnItem(col, idx)}>Remove</button>
                </div>
              ))}
              <button className="add-btn" onClick={() => addColumnItem(col)}>+ Add Item</button>
            </div>
          ))}

        <h3>Social Links</h3>
        <div className="add-heading">
          <input
            placeholder="New platform name"
            value={newHeadingKey}
            onChange={e => setNewHeadingKey(e.target.value)}
          />
          <button className="add-btn" onClick={() => addSocial(newHeadingKey)}>+ Add Social</button>
        </div>
        {Object.keys(footer.social).map(s => (
          <div key={s} className="column-item">
            <input
              placeholder="Name"
              value={footer.social[s].name}
              onChange={e => handleSocial(s, "name", e.target.value)}
            />
            <input
              placeholder="URL"
              value={footer.social[s].url}
              onChange={e => handleSocial(s, "url", e.target.value)}
            />
            <button className="delete-btn" onClick={() => removeSocial(s)}>Remove</button>
          </div>
        ))}

        <h3>Newsletter</h3>
        <textarea
          placeholder="Text"
          value={footer.newsletter.text}
          onChange={e => handleNewsletter("text", e.target.value)}
        />
        <input
          placeholder="Button"
          value={footer.newsletter.button}
          onChange={e => handleNewsletter("button", e.target.value)}
        />

        <h3>Footer Bottom</h3>
        <input
          placeholder="Copyright"
          value={footer.footerBottom.copyright}
          onChange={e => handleFooterBottom(e.target.value)}
        />

        <button className="save-btn" onClick={saveFooter}>Save Footer</button>
      </div>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminFooter;
