import { useEffect, useState } from "react";
import "./Features.css";

function Features() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/features")
      .then((res) => res.json())
      .then((data) => setFeatures(Array.isArray(data) ? data : []))
      .catch(() => setFeatures([]));
  }, []);

  if (!features.length) return null;

  const handleShopNow = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="features-wrapper">
      <h2>Experience Streamlined Shopping With Crescendo</h2>

      <div className="features-box">
        {features.map((item, index) => (
          <div className="feature-item" key={index}>
            <div className="feature-icon">
              {item.icon ? item.icon : "⭐"}
            </div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <button className="features-btn" onClick={handleShopNow}>
        Shop Now
      </button>
    </div>
  );
}

export default Features;
