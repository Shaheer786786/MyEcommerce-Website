  import { useEffect, useState } from "react";
  import { NavLink } from "react-router-dom";
  import "./admin.css";

  function AdminSidebar() {
    const [sidebar, setSidebar] = useState({ title: "Admin Panel", menus: [] });

    
    useEffect(() => {
      fetch("http://127.0.0.1:5000/admin/sidebar")
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.menus)) {
            setSidebar(data);
          }
        })
        .catch(err => console.error("Sidebar fetch error:", err));
    }, []);

    return (
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>{sidebar.title || "Admin Panel"}</h2>
        </div>

        <nav className="sidebar-nav">
          {sidebar.menus.map((menu, i) => (
            <NavLink
              key={i}
              to={menu.path}
              className={({ isActive }) =>
                isActive ? "admin-link active" : "admin-link"
              }
            >
              {menu.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  }

  export default AdminSidebar;
