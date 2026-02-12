import { useEffect, useState } from "react";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:5000/user-orders/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched orders:", data);
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (!orders.length) return <p>No orders yet.</p>;

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.displayId || order.id} className="order-card">
          <h4>Order ID: {order.displayId || order.id}</h4>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total}</p>
          <ul>
            {order.items?.map((item, i) => (
              <li key={i}>
                {item.name} x {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
