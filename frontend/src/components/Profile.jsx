// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Profile.css";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (!savedUser) navigate("/login");
//     else setUser(JSON.parse(savedUser));
//   }, [navigate]);

//   if (!user) return null;

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <img
//           src={user.image || "https://via.placeholder.com/80"}
//           alt={user.name}
//           className="profile-image"
//         />
//         <h2>{user.name}</h2>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>User ID:</strong> {user.id || "N/A"}</p>
//       </div>
//     </div>
//   );
// }

  
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [preview, setPreview] = useState("");
//   const navigate = useNavigate();

//   // Load user data
//   useEffect(() => {
//     const token = localStorage.getItem("token"); // check login
//     const savedUser = localStorage.getItem("user");

//     if (!token || !savedUser) {
//       setUser(null);
//     } else {
//       const parsed = JSON.parse(savedUser);
//       setUser({
//         firstName: parsed.firstName || parsed.name?.split(" ")[0] || "",
//         lastName: parsed.lastName || parsed.name?.split(" ")[1] || "",
//         email: parsed.email || "",
//         phone: parsed.phone || "",
//         street: parsed.street || "",
//         city: parsed.city || "",
//         state: parsed.state || "",
//         pincode: parsed.pincode || "",
//         image: parsed.image || "",
//       });
//       setPreview(parsed.image || "https://via.placeholder.com/100");
//     }
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle image upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setUser((prev) => ({ ...prev, image: reader.result }));
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

// const handleSave = () => {
//   if (!user) return;

//   // Save user
//   localStorage.setItem("user", JSON.stringify(user));

//   alert("Profile saved successfully!");

//   // 👇 Save ke baad main frontend (home) pe le jaaye
//   navigate("/");
// };


//   if (!localStorage.getItem("token")) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "150px", fontSize: "18px" }}>
//         ⚠️ Please login to view your profile.
//         <br />
//         <button
//           onClick={() => navigate("/login")}
//           style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "#0a8f08", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
//         >
//           Login
//         </button>
//       </div>
//     );
//   }

//   if (!user) return <p style={{ textAlign: "center" }}>Loading user data...</p>;

//   return (
//     <div style={{ maxWidth: "600px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//       <h2>My Profile</h2>
      
//       {/* Profile Image */}
//       <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
//         <img
//           src={preview || "https://via.placeholder.com/100"}
//           alt="Profile"
//           style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid #0a8f08" }}
//         />
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//       </div>

//       {/* Name */}
//       <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
//         <input
//           type="text"
//           placeholder="First Name"
//           name="firstName"
//           value={user.firstName}
//           onChange={handleChange}
//           style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//         />
//         <input
//           type="text"
//           placeholder="Last Name"
//           name="lastName"
//           value={user.lastName}
//           onChange={handleChange}
//           style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//         />
//       </div>

//       {/* Email and Phone */}
//       <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//         <input
//           type="email"
//           placeholder="Email"
//           name="email"
//           value={user.email}
//           onChange={handleChange}
//           style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//         />
//         <input
//           type="tel"
//           placeholder="Phone"
//           name="phone"
//           value={user.phone}
//           onChange={handleChange}
//           style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//         />
//       </div>

//       {/* Address */}
//       <div style={{ marginTop: "10px" }}>
//         <input
//           type="text"
//           placeholder="Street Address"
//           name="street"
//           value={user.street}
//           onChange={handleChange}
//           style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}
//         />
//         <div style={{ display: "flex", gap: "10px" }}>
//           <input
//             type="text"
//             placeholder="City"
//             name="city"
//             value={user.city}
//             onChange={handleChange}
//             style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//           <input
//             type="text"
//             placeholder="State"
//             name="state"
//             value={user.state}
//             onChange={handleChange}
//             style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//           <input
//             type="text"
//             placeholder="Pincode"
//             name="pincode"
//             value={user.pincode}
//             onChange={handleChange}
//             style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
//           />
//         </div>
//       </div>

//       <button
//         onClick={handleSave}
//         style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#0a8f08", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
//       >
//         Save Profile
//       </button>
//     </div>
//   );
// }
// 63

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  // Load user data
  useEffect(() => {
    const token = localStorage.getItem("token"); // check login
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      setUser(null);
    } else {
      const parsed = JSON.parse(savedUser);
      setUser({
        firstName: parsed.firstName || parsed.name?.split(" ")[0] || "",
        lastName: parsed.lastName || parsed.name?.split(" ")[1] || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        street: parsed.street || "",
        city: parsed.city || "",
        state: parsed.state || "",
        pincode: parsed.pincode || "",
        image: parsed.image || "",
      });
      setPreview(parsed.image || "https://via.placeholder.com/100");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, image: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile saved successfully!");
    navigate("/");
  };

  if (!localStorage.getItem("token")) {
    return (
      <div style={{ textAlign: "center", marginTop: "150px", fontSize: "18px" }}>
        ⚠️ Please login to view your profile.
        <br />
        <button
          onClick={() => navigate("/login")}
          style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "#0a8f08", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Login
        </button>
      </div>
    );
  }

  if (!user) return <p style={{ textAlign: "center" }}>Loading user data...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2>My Profile</h2>

      {/* Profile Image */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
        <img
          src={preview || "https://via.placeholder.com/100"}
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid #0a8f08" }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* Name */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Email and Phone */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={user.email}
          onChange={handleChange}
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="tel"
          placeholder="Phone"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {/* Address */}
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Street Address"
          name="street"
          value={user.street}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="City"
            name="city"
            value={user.city}
            onChange={handleChange}
            style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="State"
            name="state"
            value={user.state}
            onChange={handleChange}
            style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Pincode"
            name="pincode"
            value={user.pincode}
            onChange={handleChange}
            style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#0a8f08", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
      >
        Save Profile
      </button>
    </div>
  );
}