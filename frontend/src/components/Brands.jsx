import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

import "./Brands.css";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      // .get("https://mye-commerce-website.onrender.com/brands")
          get(`${BASE_URL}/brands`)

      .then((res) => setBrands(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleBrandClick = (brandName) => {
    // Navigate to products page with brand filter
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section id="brands" className="brands-section">
      <h2 className="brands-title">Explore Popular Brands</h2>

      <div className="brands-container">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="brand-card"
            onClick={() => handleBrandClick(brand.name)}
            style={{ cursor: "pointer" }}
          >
            <div className="brand-image">
              <img src={brand.image} alt={brand.name} />
            </div>
            <p className="brand-name">{brand.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
