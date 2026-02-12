import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Electronics.css";

function Electronics({ searchQuery = "", addToCart }) {
  const [electronics, setElectronics] = useState([]);
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

  // Fetch electronics
  useEffect(() => {
    const fetchElectronics = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/electronics");
        const data = await res.json();
        const filtered = Array.isArray(data) ? data.filter(item => !item.deleted) : [];
        setElectronics(filtered);
      } catch (error) {
        console.error("Electronics fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchElectronics();
  }, []);

  const filteredElectronics = electronics.filter(item =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Slider controls
  const scrollLeft = () => sliderRef.current?.scrollBy({ left: -350, behavior: "smooth" });
  const scrollRight = () => sliderRef.current?.scrollBy({ left: 350, behavior: "smooth" });

  // Toast notification
  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fade: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 500);
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

  if (loading) return <h3 className="el-loading-text">Loading electronics...</h3>;

  return (
    <section className="el-products-section">
      <h2 className="el-section-title">Electronics Products</h2>

      <button className="el-slider-btn el-left" onClick={scrollLeft}>‹</button>
      <button className="el-slider-btn el-right" onClick={scrollRight}>›</button>

      <div className="el-products-slider" ref={sliderRef}>
        {filteredElectronics.map((product, index) => {
          const imageUrl =
            product.images?.[0] ||
            (product.image?.startsWith("http") ? product.image :
              product.image ? `http://127.0.0.1:5000/images/${product.image}` :
              "https://via.placeholder.com/300");

          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={product.id}
              className={`el-product-card ${index === 0 ? "el-featured" : ""}`}
              onClick={() => window.open(`/product/${product.id}`, "_blank")}
            >
              <div className="el-product-img">
                <img src={imageUrl} alt={product.name} />
              </div>

              <div className="el-product-info">
                <h4 className="el-product-title">{product.name}</h4>
                <p className="el-product-short-desc">
                  {product.shortDesc || "Premium quality electronic product"}
                </p>

                <div className="el-rating-offer-row">
                  <div className="el-rating-box">
                    ⭐ {product.rating || 4.3} ({product.reviews || 0} Reviews)
                    <br />
                    <span className="el-stock-text">
                      {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
                    </span>
                  </div>
                  {product.offer && <span className="el-inline-offer">{product.offer}</span>}
                </div>

                <div className="el-price-box">
                  <span className="el-price">₹{product.price}</span>
                  {product.oldPrice && <span className="el-old-price">₹{product.oldPrice}</span>}
                </div>

                <div className="el-action-buttons" onClick={(e) => e.stopPropagation()}>
                  <button className="el-buy-btn" disabled={isOutOfStock} onClick={() => handleBuyNow(product)}>
                    Buy Now
                  </button>
                  <button className="el-cart-btn" disabled={isOutOfStock} onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notifications */}
      <div className="el-toast-wrapper">
        {toasts.map(t => (
          <div key={t.id} className={`el-cart-toast ${t.fade ? "el-fade-out" : "el-show"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Electronics;
