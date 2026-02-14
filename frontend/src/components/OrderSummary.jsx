// import { useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import StepsTracker from "./StepsTracker";
// import "./OrderSummary.css";

// function OrderSummary() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const steps = ["Cart", "Checkout", "Order Summary"];
//   const currentStep = 2; 

//   const [customer, setCustomer] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//     payment: "cod",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [confirmed, setConfirmed] = useState(false);

//   let { cartItems, totalAmount } = location.state || {};
//   totalAmount = Number(totalAmount) || 0;

//   useEffect(() => {
//     // If customer data sent from Checkout, prefill here
//     if (location.state?.customer) {
//       setCustomer(location.state.customer);
//     }
//   }, [location.state]);

//   if (!cartItems || cartItems.length === 0) {
//     return <p className="orders-empty">No order data available</p>;
//   }

//   const placeOrder = async () => {
//     setLoading(true);
//     setErrors({});

//     const orderData = {
//       customer,
//       items: cartItems.map(item => ({
//         ...item,
//         price: Number(item.price) || 0
//       })),
//       total: totalAmount,
//       date: new Date().toISOString(),
//     };

//     try {
//       const res = await fetch("http://127.0.0.1:5000/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       if (res.ok) setConfirmed(true);
//       else setErrors({ api: "Failed to place order. Please try again." });
//     } catch {
//       setErrors({ api: "Server error. Please try again later." });
//     } finally {
//       setLoading(false);
//       window.scrollTo(0, 0);
//     }
//   };

//   if (confirmed) {
//     return (
//       <div className="orders-success">
//         <h1>🎉 Order Placed Successfully</h1>
//         <p>Thank you for shopping with us!</p>
//         <button className="back-btn" type="button" onClick={() => navigate("/")}>
//           Back to Home
//         </button>
//       </div>
//     );
//   }

//   const getImageUrl = (item) => {
//     const image = item.images?.[0] || item.image;
//     return image?.startsWith("http")
//       ? image
//       : image
//       ? `http://127.0.0.1:5000/images/${image}`
//       : "/default-product.png";
//   };

//   return (
//     <div className="orders-summary">
//       <StepsTracker steps={steps} currentStep={currentStep} />

//       <h3 className="orders-title">Review & Confirm Your Order</h3>

//       <div className="orders-grid">
//         <div className="order-card">
//           <h4>Delivery Details</h4>
//           <div className="order-details">
//             <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
//             <p><strong>Email:</strong> {customer.email}</p>
//             <p><strong>Phone:</strong> {customer.phone}</p>
//             <p><strong>Address:</strong> {customer.address}, {customer.city}, {customer.state} - {customer.pincode}</p>
//           </div>

//           <h4 className="payment-p">Payment Method</h4>
//           <p className="payment-method">
//             {customer.payment === "cod" ? "Cash on Delivery" : "Online Payment"}
//           </p>

//           {errors.api && <p className="error-msg">{errors.api}</p>}

//           <div className="order-footer">
//             <p>Total Amount: <strong>₹{totalAmount.toFixed(2)}</strong></p>
//             <button onClick={placeOrder} disabled={loading} className="confirm-btn">
//               {loading ? "Placing Order..." : "Confirm Order"}
//             </button>
//           </div>
//         </div>

//         <div className="order-card">
//           <h4>Order Items</h4>
//           {cartItems.map((item) => {
//             const price = Number(item.price) || 0;
//             return (
//               <div className="order-item" key={item.id}>
//                 <img
//                   src={getImageUrl(item)}
//                   alt={item.name}
//                   loading="lazy"
//                 />
//                 <div>
//                   <p className="item-name">{item.name}</p>
//                   <p>Quantity: {item.quantity}</p>
//                   <p>Price: ₹{price.toFixed(2)}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderSummary;


import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StepsTracker from "./StepsTracker";
import BASE_URL from "../config";

import "./OrderSummary.css";

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const steps = ["Cart", "Checkout", "Order Summary"];
  const currentStep = 2; 

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "cod",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  let { cartItems, totalAmount } = location.state || {};
  totalAmount = Number(totalAmount) || 0;

  useEffect(() => {
    if (location.state?.customer) {
      setCustomer(location.state.customer);
    }
  }, [location.state]);

  if (!cartItems || cartItems.length === 0) {
    return <p className="orders-empty">No order data available</p>;
  }

  const placeOrder = async () => {
    setLoading(true);
    setErrors({});

    const orderData = {
      customer,
      items: cartItems.map(item => ({
        ...item,
        price: Number(item.price) || 0
      })),
      total: totalAmount,
      date: new Date().toISOString(),
    };

    try {
      const res = await 
      // fetch("http://127.0.0.1:5000/orders",
        fetch(`${BASE_URL}/orders`,

         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) setConfirmed(true);
      else setErrors({ api: "Failed to place order. Please try again." });
    } catch {
      setErrors({ api: "Server error. Please try again later." });
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  if (confirmed) {
    return (
      <div className="orders-success">
        <h1>🎉 Order Placed Successfully</h1>
        <p>Thank you for shopping with us!</p>
        <button className="back-btn" type="button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const getImageUrl = (item) => {
    const image = item.images?.[0] || item.image;
    return image?.startsWith("http")
      ? image
      : image
      ? `http://127.0.0.1:5000/images/${image}`
      : "/default-product.png";
  };

  return (
    <div className="orders-summary">
      <StepsTracker steps={steps} currentStep={currentStep} />

      <h3 className="orders-title">Review & Confirm Your Order</h3>

      <div className="orders-grid">
        <div className="order-card">
          <h4>Delivery Details</h4>
          <div className="order-details">
            <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>Address:</strong> {customer.address}, {customer.city}, {customer.state} - {customer.pincode}</p>
          </div>

          <h4 className="payment-p">Payment Method</h4>
          <p className="payment-method">
            {customer.payment === "cod" ? "Cash on Delivery" : "Online Payment"}
          </p>

          {errors.api && <p className="error-msg">{errors.api}</p>}

          <div className="order-footer">
            <p>Total Amount: <strong>₹{totalAmount.toFixed(2)}</strong></p>
            <button onClick={placeOrder} disabled={loading} className="confirm-btn">
              {loading ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>

        <div className="order-card">
          <h4>Order Items</h4>
          {cartItems.map((item) => {
            const price = Number(item.price) || 0;
            return (
              <div className="order-item" key={item.id}>
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  loading="lazy"
                />
                <div>
                  <p className="item-name">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;