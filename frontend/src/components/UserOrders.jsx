import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../config";
import "./UserOrders.css";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.log("User not logged in");
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/user-orders/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (!orders || orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>
      <p className="total-orders">Total Orders: <strong>{orders.length}</strong></p>

      {orders.map((order) => {
        const totalAmount = order.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const totalProducts = order.items.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
const trackingSteps = [
  "Order Placed",
  "Order Confirmed",
  "Packed the product",
  "Arrived in warehouse",
  "Near by courier facility",
  "Out for Delivery",
  "Delivered"
];

const currentIndex = trackingSteps.indexOf(order.status);

        return (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <h4>Order #{order._id}</h4>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
<div className="tracking-bar">

{trackingSteps.map((step, index) => (

<div key={index} className="tracking-step">

<div className={`circle ${index <= currentIndex ? "active" : ""}`}>
{index < currentIndex ? "✓" : ""}
</div>

{index !== trackingSteps.length - 1 && (
<div className={`line ${index < currentIndex ? "active" : ""}`} />
)}

<p>{step}</p>

</div>

))}

</div>
            <p className="order-summary">
              Total Products: <strong>{totalProducts}</strong> | Total Amount: <strong>₹{totalAmount}</strong>
            </p>

            <p className="shipping-info">
              Ship to: {order.customer?.firstName} {order.customer?.lastName}, {order.customer?.city}, {order.customer?.address}
            </p>

            <div className="products-grid">
              <div className="grid-header">
                <span>Image</span>
                <span>Name</span>
                <span>Qty</span>
                <span>Price</span>
                <span>Total</span>
                <span>Offer</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="grid-row">
                  <Link to={`/product/${item.id}`}>
                    <img src={item.image} alt={item.name} className="product-img"/>
                  </Link>
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                  <span>₹{item.price}</span>
                  <span>₹{item.price * item.quantity}</span>
                  <span>{item.offer || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}