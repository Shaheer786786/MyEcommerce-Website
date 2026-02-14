// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./BannerTwo.css";

// export default function BannerTwo() {
//   const [banners, setBanners] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:5000/banners-two")
//       .then((res) => setBanners(res.data))
//       .catch((err) => console.error("Banner Fetch Error:", err));
//   }, []);

//   if (banners.length < 5) {
//     return <p className="bt-error">❗ 5 banners required</p>;
//   }

//   // Open product detail using banner.id
//   const openProductDetail = (banner) => {
//     window.open(`/product/${banner.id}`, "_blank");
//   };

//   return (
//     <div id="big-sale" className="bt-wrapper">
//       {/* LEFT BIG */}
//       <div className="bt-large-box">
//         <img
//           src={banners[0].image}
//           alt={banners[0].title}
//           onClick={() => openProductDetail(banners[0])}
//           style={{ cursor: "pointer" }}
//         />
//         <div className="bt-text">
//           <h2>{banners[0].title}</h2>
//           <p>{banners[0].subtitle}</p>
//           {banners[0].offer && <span className="bt-offer">{banners[0].offer}</span>}
//           <button onClick={() => openProductDetail(banners[0])}>View</button>
//         </div>
//       </div>

//       {/* RIGHT GRID */}
//       <div className="bt-grid">
//         {banners.slice(1, 5).map((b) => (
//           <div className="bt-small-box" key={b.id}>
//             <img
//               src={b.image}
//               alt={b.title}
//               onClick={() => openProductDetail(b)}
//               style={{ cursor: "pointer" }}
//             />
//             <div className="bt-small-text">
//               <h3>{b.title}</h3>
//               <p>{b.subtitle}</p>
//               {b.offer && <span className="bt-small-offer">{b.offer}</span>}
//               <button onClick={() => openProductDetail(b)}>View More</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import "./BannerTwo.css";

export default function BannerTwo() {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/banners-two`)
      .then((res) => res.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch((err) => console.error("BannerTwo Fetch Error:", err));
  }, []);

  if (banners.length < 5) {
    return <p className="bt-error">❗ 5 banners required</p>;
  }

  /* ================= OPEN PRODUCT DETAIL ================= */
  const openProductDetail = (banner) => {
    navigate(`/product/${banner.id}`);
  };

  return (
    <div id="big-sale" className="bt-wrapper">
      {/* ===== Large Banner ===== */}
      <div className="bt-large-box">
        <img
          src={
            banners[0].image?.startsWith("http")
              ? banners[0].image
              : `${BASE_URL}/images/${banners[0].image}`
          }
          alt={banners[0].title}
          onClick={() => openProductDetail(banners[0])}
          style={{ cursor: "pointer" }}
        />

        <div className="bt-text">
          <h2>{banners[0].title}</h2>
          <p>{banners[0].subtitle}</p>

          {banners[0].offer && (
            <span className="bt-offer">
              {banners[0].offer}
            </span>
          )}

          <button onClick={() => openProductDetail(banners[0])}>
            View
          </button>
        </div>
      </div>

      {/* ===== 4 Small Banners ===== */}
      <div className="bt-grid">
        {banners.slice(1, 5).map((b) => (
          <div className="bt-small-box" key={b.id}>
            <img
              src={
                b.image?.startsWith("http")
                  ? b.image
                  : `${BASE_URL}/images/${b.image}`
              }
              alt={b.title}
              onClick={() => openProductDetail(b)}
              style={{ cursor: "pointer" }}
            />

            <div className="bt-small-text">
              <h3>{b.title}</h3>
              <p>{b.subtitle}</p>

              {b.offer && (
                <span className="bt-small-offer">
                  {b.offer}
                </span>
              )}

              <button onClick={() => openProductDetail(b)}>
                View More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}