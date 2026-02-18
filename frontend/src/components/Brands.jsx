// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Brands.css";

// export default function Brands() {
//   const [brands, setBrands] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:5000/brands")
//       .then((res) => setBrands(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const handleBrandClick = (brandName) => {
//     // Navigate to products page with brand filter
//     navigate(`/products?brand=${encodeURIComponent(brandName)}`);
//   };

//   return (
//     <section id="brands" className="brands-section">
//       <h2 className="brands-title">Explore Popular Brands</h2>

//       <div className="brands-container">
//         {brands.map((brand) => (
//           <div
//             key={brand.id}
//             className="brand-card"
//             onClick={() => handleBrandClick(brand.name)}
//             style={{ cursor: "pointer" }}
//           >
//             <div className="brand-image">
//               <img src={brand.image} alt={brand.name} />
//             </div>
//             <p className="brand-name">{brand.name}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config"; // <- Import BASE_URL
import "./Brands.css";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/brands`) // <- Live backend URL
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Brands fetch error:", err));
  }, []);

const handleBrandClick = (brand) => {
  if (brand.url) {
    window.open(
      brand.url.startsWith("http")
        ? brand.url
        : `https://${brand.url}`,
      "_blank"
    );
  } else {
    navigate(`/products?brand=${encodeURIComponent(brand.name)}`);
  }
};

  return (
    <section id="brands" className="brands-section">
      <h2 className="brands-title">Explore Popular Brands</h2>

      <div className="brands-container">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="brand-card"
            onClick={() => handleBrandClick(brand)}            
            style={{ cursor: "pointer" }}
            >
            <div className="brand-image">
              <img
                src={brand.image?.startsWith("http") ? brand.image : `${BASE_URL}/images/${brand.image}`}
                alt={brand.name}
              />
            </div>
            <p className="brand-name">{brand.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}