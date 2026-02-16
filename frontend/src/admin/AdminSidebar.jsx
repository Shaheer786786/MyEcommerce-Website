  // import { useEffect, useState } from "react";
  // import { NavLink } from "react-router-dom";
  // import "./admin.css";

  // function AdminSidebar() {
  //   const [sidebar, setSidebar] = useState({ title: "Admin Panel", menus: [] });

    
  //   useEffect(() => {
  //     fetch("http://127.0.0.1:5000/admin/sidebar")
  //       .then(res => res.json())
  //       .then(data => {
  //         if (data && Array.isArray(data.menus)) {
  //           setSidebar(data);
  //         }
  //       })
  //       .catch(err => console.error("Sidebar fetch error:", err));
  //   }, []);

  //   return (
  //     <aside className="admin-sidebar">
  //       <div className="sidebar-header">
  //         <h2>{sidebar.title || "Admin Panel"}</h2>
  //       </div>

  //       <nav className="sidebar-nav">
  //         {sidebar.menus.map((menu, i) => (
  //           <NavLink
  //             key={i}
  //             to={menu.path}
  //             className={({ isActive }) =>
  //               isActive ? "admin-link active" : "admin-link"
  //             }
  //           >
  //             {menu.name}
  //           </NavLink>
  //         ))}
  //       </nav>
  //     </aside>
  //   );
  // }

  // export default AdminSidebar;

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import BASE_URL from "../config";
import "./admin.css";

function AdminSidebar() {
  const [sidebar, setSidebar] = useState({ title: "Admin Panel", menus: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // ⭐ mobile toggle

  useEffect(() => {
    fetch(`${BASE_URL}/admin/sidebar`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.menus)) {
          setSidebar(data);
        }
      })
      .catch((err) => {
        console.error("Sidebar fetch error:", err);
        setError("Failed to load sidebar");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <aside className="admin-sidebar">Loading...</aside>;
  if (error) return <aside className="admin-sidebar">{error}</aside>;

  return (
    <>
      {/* ⭐ Mobile Top Bar */}
      <div className="admin-mobile-bar">
        <button
          className="admin-hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <span className="mobile-title">{sidebar.title}</span>
      </div>

      <aside className={`admin-sidebar ${isOpen ? "show" : ""}`}>
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
              onClick={() => setIsOpen(false)} // mobile pe click kare to close
            >
              {menu.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;