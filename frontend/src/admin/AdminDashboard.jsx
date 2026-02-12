// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import "./AdminDashboard.css";

// // Backend socket connection
// const socket = io("http://localhost:5000");

// const SummaryCard = ({ title, value, icon, bgColor }) => (
//   <div className="summary-card" style={{ backgroundColor: bgColor }}>
//     <div className="summary-icon">{icon}</div>
//     <div className="summary-info">
//       <h4>{title}</h4>
//       <p>{value}</p>
//     </div>
//   </div>
// );

// const ProfileCard = ({ profile }) => (
//   <div className="profile-card">
//     <img
//       src={profile.image || "/default-profile.png"}
//       alt={profile.name}
//       className="profile-image"
//     />
//     <div className="profile-info">
//       <h2>
//         {profile.name} ⭐️{profile.rating || 0}{" "}
//         <small>({profile.reviews || 0} Reviews)</small>
//       </h2>
//       <p>
//         <strong>Location:</strong> {profile.location || "N/A"} &nbsp;|&nbsp;
//         <strong>Joined:</strong> {profile.joined || "N/A"} &nbsp;|&nbsp;
//         <strong>Age:</strong> {profile.age || "N/A"} &nbsp;|&nbsp;
//         <strong>Gender:</strong> {profile.gender || "N/A"}
//       </p>
//       <div className="profile-tags">
//         {(profile.tags || []).map((tag) => (
//           <span key={tag} className="profile-tag">
//             {tag}
//           </span>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// export default function AdminDashboard() {
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState({});
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // Initial data fetch
//     fetch("http://localhost:5000/admin/dashboard/profile")
//       .then((res) => res.json())
//       .then(setProfile);

//     fetch("http://localhost:5000/admin/dashboard/stats")
//       .then((res) => res.json())
//       .then(setStats);

//     fetch("http://localhost:5000/orders")
//       .then((res) => res.json())
//       .then((data) => {
//         // Newest orders top pe dikhaye
//         const sortedOrders = data.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         setOrders(sortedOrders);
//       });

//     fetch("http://localhost:5000/admin/dashboard/products")
//       .then((res) => res.json())
//       .then(setProducts);

//     // Real-time socket updates
//     socket.on("dashboard_update", (data) => {
//       setStats(data.stats);
//       const sortedOrders = data.orders.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setOrders(sortedOrders);
//       setProducts(data.products);
//     });

//     return () => socket.off("dashboard_update");
//   }, []);

//   // Order status update function
//   const updateOrderStatus = (orderId, status) => {
//     fetch(`http://localhost:5000/orders/${orderId}/status`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setOrders((prev) =>
//             prev.map((order) =>
//               order.displayId === orderId ? { ...order, status: status } : order
//             )
//           );
//         } else {
//           alert("Failed to update status: " + (data.error || "Unknown error"));
//         }
//       })
//       .catch(() => alert("Network error updating order status"));
//   };

//   return (
//     <div className="dashboard-container">
//       <h1>E-Commerce Admin Dashboard</h1>

//       {profile && <ProfileCard profile={profile} />}

// <div className="summary-cards">
//   <SummaryCard
//     title="Total Customers"
//     value={stats.totalCustomers || 0}
//     icon="👥"
//     bgColor="#ff9800"
//   />

//   <SummaryCard
//     title="New Today"
//     value={stats.newCustomersToday || 0}
//     icon="🆕"
//     bgColor="#4caf50"
//   />

//   <SummaryCard
//     title="New This Week"
//     value={stats.newCustomersWeek || 0}
//     icon="📅"
//     bgColor="#2196f3"
//   />

//   <SummaryCard
//     title="Total Revenue"
//     value={`₹${stats.totalRevenue || 0}`}
//     icon="💰"
//     bgColor="#9c27b0"
//   />
// </div>


//       <section className="section orders-section">
//         <h2>Recent Orders</h2>
//         <div className="orders-table-wrapper">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Address</th>
//                 <th>Products</th>
//                 <th>Quantity</th>
//                 <th>Total</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
// <tr key={order._id}>
//   <td>#{order._id}</td>

//   <td>
//     {(order.customer?.firstName || "")}{" "}
//     {(order.customer?.lastName || "")}
//   </td>

//   <td>{order.customer?.email || "N/A"}</td>
//   <td>{order.customer?.phone || "N/A"}</td>
//   <td className="address-cell">
//     {order.customer?.address || "N/A"}
//   </td>

// <td className="products-cell">
//   <div className="products-list">
//     {order.items.map((item, i) => (
//       <div key={i} className="product-row">
//         <img
//           src={item.images?.[0] || item.image || "/default-product.png"}
//           alt={item.name}
//           className="product-thumb"
//         />
//         <span className="product-name">{item.name}</span>
//       </div>
//     ))}
//   </div>
// </td>


//   <td>
//     <div>
//       {order.items.map((item, i) => (
//         <span key={i}>{item.quantity}</span>
//       ))}
//     </div>
//   </td>

//   <td>₹{order.total.toFixed(2)}</td>

//   <td>{new Date(order.createdAt).toLocaleString("en-IN")}</td>

//   <td>
//     <span className={`status-badge status-${order.status.toLowerCase()}`}>
//       {order.status}
//     </span>
//   </td>

//   <td>
//     {order.status !== "Completed" && (
//       <button
//         className="btn-complete"
//         onClick={() => updateOrderStatus(order._id, "Completed")}
//       >
//         Complete
//       </button>
//     )}
//     {order.status !== "Cancelled" && (
//       <button
//         className="btn-cancel"
//         onClick={() => updateOrderStatus(order._id, "Cancelled")}
//       >
//         Cancel
//       </button>
//     )}
//   </td>
// </tr>


//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
// <section className="tp-section">
//   <h2>Top Products</h2>
//   <div className="tp-grid">
//     {products
//       .sort((a, b) => b.sales - a.sales) // zyada sold products pehle
//       .map((p) => (
//         <div key={p.id} className="tp-card">
//           <img
//             src={p.images?.[0] || p.image || "/default-product.png"}
//             alt={p.name}
//             className="tp-thumb"
//           />
//           <div className="tp-info">
//             <p className="tp-name">{p.name}</p>
//             <p className="tp-sold">{p.sales} sold</p>
//           </div>
//         </div>
//       ))}
//   </div>
// </section>

//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const socket = io("http://localhost:5000");

const SummaryCard = ({ title, value, icon, bgColor }) => (
  <div className="summary-card" style={{ backgroundColor: bgColor }}>
    <div className="summary-icon">{icon}</div>
    <div className="summary-info">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  </div>
);

const ProfileCard = ({ profile }) => (
  <div className="profile-card">
    <img
      src={profile.image || "/default-profile.png"}
      alt={profile.name}
      className="profile-image"
    />
    <div className="profile-info">
      <h2>
        {profile.name} ⭐️{profile.rating || 0}{" "}
        <small>({profile.reviews || 0} Reviews)</small>
      </h2>
      <p>
        <strong>Location:</strong> {profile.location || "N/A"} &nbsp;|&nbsp;
        <strong>Joined:</strong> {profile.joined || "N/A"} &nbsp;|&nbsp;
        <strong>Age:</strong> {profile.age || "N/A"} &nbsp;|&nbsp;
        <strong>Gender:</strong> {profile.gender || "N/A"}
      </p>
      <div className="profile-tags">
        {(profile.tags || []).map((tag) => (
          <span key={tag} className="profile-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const UserActivity = ({ activities }) => (
  <section className="user-activity-section">
    <h2>User Activity Log</h2>
    <div className="user-activity-list">
      {activities.length === 0 ? (
        <p>No recent activities</p>
      ) : (
        activities.map((act, idx) => (
          <div key={idx} className="user-activity-item">
            <div>
              <strong>{act.user}</strong> -{" "}
              <span className={`activity-type ${act.type.toLowerCase()}`}>
                {act.type}
              </span>
            </div>
            <div>{new Date(act.time).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  </section>
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("adminLoggedIn"));
    if (!admin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/dashboard/profile")
      .then((res) => res.json())
      .then(setProfile);

    fetch("http://localhost:5000/admin/dashboard/stats")
      .then((res) => res.json())
      .then(setStats);

    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => {
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      });

    fetch("http://localhost:5000/admin/dashboard/products")
      .then((res) => res.json())
      .then(setProducts);

    fetch("http://localhost:5000/admin/dashboard/activities")
      .then((res) => res.json())
      .then(setActivities);

    socket.on("dashboard_update", (data) => {
      setStats(data.stats);
      const sortedOrders = data.orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setProducts(data.products);
      setActivities(data.activities || []);
    });

    return () => socket.off("dashboard_update");
  }, []);

  const updateOrderStatus = (orderId, status) => {
    fetch(`http://localhost:5000/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders((prev) =>
            prev.map((order) =>
              order._id === orderId ? { ...order, status } : order
            )
          );
        } else {
          alert("Failed to update status: " + (data.error || "Unknown error"));
        }
      })
      .catch(() => alert("Network error updating order status"));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  return (
    <div className="dashboard-container">
      <h1>E-Commerce Admin Dashboard</h1>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      {profile && <ProfileCard profile={profile} />}

      <div className="summary-cards">
        <SummaryCard
          title="Total Customers"
          value={stats.totalCustomers || 0}
          icon="👥"
          bgColor="#ff9800"
        />
        <SummaryCard
          title="New Today"
          value={stats.newCustomersToday || 0}
          icon="🆕"
          bgColor="#4caf50"
        />
        <SummaryCard
          title="New This Week"
          value={stats.newCustomersWeek || 0}
          icon="📅"
          bgColor="#2196f3"
        />
        <SummaryCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue || 0}`}
          icon="💰"
          bgColor="#9c27b0"
        />
      </div>

      <section className="orders-section">
        <h2>Recent Orders</h2>
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Products</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id}</td>
                  <td>
                    {order.customer?.firstName || ""}{" "}
                    {order.customer?.lastName || ""}
                  </td>
                  <td>{order.customer?.email || "N/A"}</td>
                  <td>{order.customer?.phone || "N/A"}</td>
                  <td className="address-cell">{order.customer?.address || "N/A"}</td>
                  <td className="products-cell">
                    <div className="products-list">
                      {order.items.map((item, i) => (
                        <div key={i} className="product-row">
                          <img
                            src={item.images?.[0] || item.image || "/default-product.png"}
                            alt={item.name}
                            className="product-thumb"
                          />
                          <span className="product-name">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div>
                      {order.items.map((item, i) => (
                        <span key={i}>{item.quantity}</span>
                      ))}
                    </div>
                  </td>
                  <td>₹{order.total.toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleString("en-IN")}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status !== "Completed" && (
                      <button
                        className="btn-complete"
                        onClick={() => updateOrderStatus(order._id, "Completed")}
                      >
                        Complete
                      </button>
                    )}
                    {order.status !== "Cancelled" && (
                      <button
                        className="btn-cancel"
                        onClick={() => updateOrderStatus(order._id, "Cancelled")}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="tp-section">
        <h2>Top Products</h2>
        <div className="tp-grid">
          {products
            .sort((a, b) => b.sales - a.sales)
            .map((p) => (
              <div key={p.id} className="tp-card">
                <img
                  src={p.images?.[0] || p.image || "/default-product.png"}
                  alt={p.name}
                  className="tp-thumb"
                />
                <div className="tp-info">
                  <p className="tp-name">{p.name}</p>
                  <p className="tp-sold">{p.sales} sold</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      <UserActivity activities={activities} />
    </div>
  );
}
