// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Products.css";

// function Products({ searchQuery = "", addToCart }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [toasts, setToasts] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const resProducts = await fetch("http://127.0.0.1:5000/products");
//         const productsData = await resProducts.json();

//         // const resLatest = await fetch("http://127.0.0.1:5000/latestProducts");
//         // const latestData = await resLatest.json();

//         const merged = [
//           // ...(Array.isArray(latestData) ? latestData : []),
//           ...(Array.isArray(productsData) ? productsData : []),
//         ].filter((p) => !p.deleted);

//         const sortedById = merged.sort((a, b) => a.id - b.id);
//         setProducts(sortedById);
//       } catch (err) {
//         console.error(err);
//         setProducts([]);
//       }
//       setLoading(false);
//     };

//     fetchProducts();
//   }, []);

//   const filteredProducts = products.filter((p) =>
//     p?.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Toast logic
//   const showToast = (message) => {
//     const id = Date.now();
//     const newToast = { id, message };
//     setToasts((prev) => [...prev, newToast]);

//     setTimeout(() => {
//       setToasts((prev) =>
//         prev.map((t) => (t.id === id ? { ...t, fade: true } : t))
//       );
//       setTimeout(() => {
//         setToasts((prev) => prev.filter((t) => t.id !== id));
//       }, 500);
//     }, 2500);
//   };

//   // UPDATED: Navigate to checkout.jsx instead of order-summary
//   const handleBuyNow = (product) => {
//     navigate("/checkout", {
//       state: { cartItems: [{ ...product, quantity: 1 }], totalAmount: product.price },
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleAddToCart = (product) => {
//     if (addToCart) addToCart(product, 1);
//     showToast(`1 ${product.name} added to cart`);
//   };

//   if (loading) {
//     return (
//       <h2 style={{ padding: "40px", textAlign: "center" }}>
//         Loading Products...
//       </h2>
//     );
//   }

//   return (
//     <div className="Product_name" id="products">
//       <div className="products-container2">
//         {!filteredProducts.length ? (
//           <h3 style={{ textAlign: "center", width: "100%" }}>
//             No products found
//           </h3>
//         ) : (
//           filteredProducts.map((product) => {
//             const imageUrl =
//               product.images?.[0] ||
//               (product.image?.startsWith("http")
//                 ? product.image
//                 : product.image
//                 ? `http://127.0.0.1:5000/images/${product.image}`
//                 : "https://via.placeholder.com/300");

//             const stockText = product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock";
//             const isOutOfStock = product.stock === 0;

//             return (
//               <div
//                 key={product.id}
//                 className="product-card"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => window.open(`/product/${product.id}`, "_blank")} 
//               >
//                 <img src={imageUrl} alt={product.name} />

//                 <h3 className="product-title">{product.name}</h3>

//                 <p className="product-short-desc">
//                   {product.shortDesc || "High performance with premium quality"}
//                 </p>

//                 <div className="rating-offer-row">
//                   <div className="rating-box">
//                     ⭐ {product.rating || 4.3} ({product.reviews || 0} Reviews)
//                     <br />
//                     <span className="stock-text">{stockText}</span>
//                   </div>
//                   {product.offer && <span className="inline-offer">{product.offer}</span>}
//                 </div>

//                 <div className="price-box">
//                   <span className="price">₹{product.price}</span>
//                   {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
//                 </div>

//                 <div
//                   className="action-buttons"
//                   onClick={(e) => e.stopPropagation()} 
//                 >
//                   <button
//                     className="buy-btn"
//                     disabled={isOutOfStock}
//                     onClick={() => handleBuyNow(product)}
//                   >
//                     Buy Now
//                   </button>
//                   <button
//                     className="cart-btn"
//                     disabled={isOutOfStock}
//                     onClick={() => handleAddToCart(product)}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Toasts */}
//       <div className="toast-wrapper">
//         {toasts.map((toast) => (
//           <div key={toast.id} className={`cart-toast ${toast.fade ? "fade-out" : "show"}`}>
//             {toast.message}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Products;
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";

function Products({ searchQuery = "", addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [user, setUser] = useState(null); // ✅ Logged in user
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:5000/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.filter((p) => !p.deleted) : []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollLeft = () => sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
  const scrollRight = () => sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });

  // Toast helper
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, fade: true } : t))
      );
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 500);
    }, 2500);
  };

  // ✅ Login check wrapper
  const requireLogin = (callback) => {
    if (!user) {
      showToast("Please login first to continue!");
      navigate("/login");
      return false;
    }
    callback();
    return true;
  };

  const handleAddToCart = (product) => requireLogin(() => {
    addToCart?.(product, 1);
    showToast(`1 ${product.name} added to cart`);
  });

  const handleBuyNow = (product) => requireLogin(() => {
    navigate("/checkout", {
      state: { cartItems: [{ ...product, quantity: 1 }], totalAmount: product.price },
    });
  });

  if (loading) {
    return <h3 className="prd-loading-text">Loading products...</h3>;
  }

  return (
    <section id="products" className="prd-products-section">
      <h2 className="prd-section-title">Food and Seeds Products</h2>

      <button className="prd-slider-btn prd-left" onClick={scrollLeft}>‹</button>
      <button className="prd-slider-btn prd-right" onClick={scrollRight}>›</button>

      <div className="prd-products-slider" ref={sliderRef}>
        {filteredProducts.map((product, index) => {
          const imageUrl =
            product.images?.[0] ||
            (product.image?.startsWith("http") ? product.image :
              product.image ? `http://127.0.0.1:5000/images/${product.image}` :
              "https://via.placeholder.com/300");

          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={product.id}
              className={`prd-product-card ${index === 0 ? "prd-featured" : ""}`}
              onClick={() => window.open(`/product/${product.id}`, "_blank")}
            >
              <div className="prd-product-img">
                <img src={imageUrl} alt={product.name} />
              </div>

              <div className="prd-product-info">
                <h4 className="prd-product-title">{product.name}</h4>
                <p className="prd-product-short-desc">
                  {product.shortDesc || "High performance with premium quality"}
                </p>

                <div className="prd-rating-offer-row">
                  <div className="prd-rating-box">
                    ⭐ {product.rating || 4.3} ({product.reviews || 0} Reviews)
                    <br />
                    <span className="prd-stock-text">
                      {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
                    </span>
                  </div>
                  {product.offer && <span className="prd-inline-offer">{product.offer}</span>}
                </div>

                <div className="prd-price-box">
                  <span className="prd-price">₹{product.price}</span>
                  {product.oldPrice && <span className="prd-old-price">₹{product.oldPrice}</span>}
                </div>

                <div className="prd-action-buttons" onClick={(e) => e.stopPropagation()}>
                  <button className="prd-buy-btn" disabled={isOutOfStock} onClick={() => handleBuyNow(product)}>
                    Buy Now
                  </button>
                  <button className="prd-cart-btn" disabled={isOutOfStock} onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast wrapper */}
      <div className="prd-toast-wrapper">
        {toasts.map((t) => (
          <div key={t.id} className={`prd-cart-toast ${t.fade ? "prd-fade-out" : "prd-show"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
