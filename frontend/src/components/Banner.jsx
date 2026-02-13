// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; 
// import BASE_URL from "../config";
// import "./Banner.css";

// function Banner() {
//   const [banners, setBanners] = useState([]);
//   const [index, setIndex] = useState(0);
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     // fetch("https://my-backend-93up.onrender.com/banner")
//     fetch(`${BASE_URL}/banner`)
//       .then(res => res.json())
//       .then(data => setBanners(data.filter(b => !b.deleted)))
//       .catch(err => console.error("Banner fetch error:", err));
//   }, []);

//   useEffect(() => {
//     if (banners.length === 0) return;
//     const timer = setInterval(() => {
//       setIndex(prev => (prev + 1) % banners.length);
//     }, 4000);
//     return () => clearInterval(timer);
//   }, [banners]);

//   const banner = banners[index];
//   if (!banner) return null;

//   const bannerImage = banner.image?.startsWith("http")
//     ? banner.image
//     : `https://my-backend-93up.onrender.com/images/${banner.image}`;

//   const handleClick = () => {
//     if (banner.productId) {
//       navigate(`/product/${banner.productId}`);
//     } else if (banner.buttonLink) {
//       window.location.href = banner.buttonLink;
//     }
//   };

//   return (
//     <div
//       className="banner-slider"
//       style={{ backgroundImage: `url(${bannerImage})`, cursor: "pointer" }}
//       onClick={handleClick} 
//     >
//       <div className="banner-overlay">
//         <div className="banner-content">
//           <h1>{banner.title}</h1>
//           <p>{banner.subtitle}</p>

//           {banner.buttonText && banner.buttonLink && (
//             <a href={banner.buttonLink} className="banner-btn" onClick={(e) => e.stopPropagation()}>
//               {banner.buttonText}
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Banner;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import BASE_URL from "../config";
import "./Banner.css";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/banner`)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => setBanners(data.filter(b => !b.deleted)))
      .catch(err => console.error("Banner fetch error:", err));
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  const banner = banners[index];
  if (!banner) return null;

  // Image URL from live backend
  const bannerImage = banner.image?.startsWith("http")
    ? banner.image
    : `${BASE_URL}/images/${banner.image}`;

  const handleClick = () => {
    if (banner.productId) {
      navigate(`/product/${banner.productId}`);
    } else if (banner.buttonLink) {
      window.open(banner.buttonLink, "_blank");
    }
  };

  return (
    <div
      className="banner-slider"
      style={{ backgroundImage: `url(${bannerImage})`, cursor: "pointer" }}
      onClick={handleClick} 
    >
      <div className="banner-overlay">
        <div className="banner-content">
          <h1>{banner.title}</h1>
          <p>{banner.subtitle}</p>

          {banner.buttonText && banner.buttonLink && (
            <a
              href={banner.buttonLink}
              className="banner-btn"
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {banner.buttonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;