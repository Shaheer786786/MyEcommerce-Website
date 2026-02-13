import { useEffect, useState } from "react";
import "./Promo.css";

function Promo() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://mye-commerce-website.onrender.com/promo")
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setItems([]));
  }, []);

  if (!items.length) return null;

  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `https://mye-commerce-website.onrender.com/images/${img}`;
  };

  return (
    <section className="promo-grid">
      {items.map((p, index) => (
        <div
          key={index}
          className={`promo-card style-${index + 1}`}
          style={{ backgroundImage: `url(${getImageUrl(p.image)})` }}
        >
          <div className="promo-overlay"></div>

          <div className="promo-content">
            {p.badge && <span className="promo-badge">{p.badge}</span>}
            <h3>{p.title}</h3>
            <p>{p.subtitle}</p>

            {p.buttonLink && (
              <a href={p.buttonLink} className="promo-btn">
                {p.buttonText || "Shop Now"}
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export default Promo;
