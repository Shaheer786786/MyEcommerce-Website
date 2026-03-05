import { useEffect, useState } from "react";
import BASE_URL from "../config";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ safety check
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    // ✅ USE BASE_URL (IMPORTANT)
    fetch(`${BASE_URL}/user-orders/${user.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched orders:", data);
        setOrders(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Order fetch error:", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your orders...</p>;

  if (!orders.length)
    return <p>No orders yet.</p>;

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id || order.id}
          className="order-card"
        >
          <h4>
            Order ID: {order.displayId || order._id}
          </h4>

          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total}</p>

          <ul>
            {order.items?.map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity} =
                ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}