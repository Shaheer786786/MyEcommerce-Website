import { useEffect, useState } from "react";
import "./admin.css";

function AdminTopbar() {
  const [topbar, setTopbar] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/admin/topbar")
      .then(res => res.json())
      .then(setTopbar);
  }, []);

  if (!topbar) return null;

  return (
    <div className="admin-topbar">
      {topbar.title}
    </div>
  );
}

export default AdminTopbar;
