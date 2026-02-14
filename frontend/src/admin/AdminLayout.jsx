import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import BASE_URL from "../config"; // BASE_URL import
import "./admin.css";

function AdminLayout() {
  const [topbar, setTopbar] = useState({ title: "Admin Panel" });

  useEffect(() => {
    fetch(`${BASE_URL}/admin/topbar`) // BASE_URL used
      .then(res => res.json())
      .then(data => {
        if (data && data.title) setTopbar(data);
      })
      .catch(err => console.error("Topbar error:", err));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <div className="admin-topbar">
          <h2>{topbar.title}</h2>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;