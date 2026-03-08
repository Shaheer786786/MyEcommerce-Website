// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./OwnerProfile.css";

// const BASE_URL = "http://127.0.0.1:5000";

// export default function OwnerProfile() {
//   const [profile, setProfile] = useState({});
//   const [editMode, setEditMode] = useState(false);
//   const [imageFile, setImageFile] = useState(null);

//   // ✅ Load profile on component mount
//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/admin/owner-profile`)
//       .then((res) => {
//         if (res.data.success) setProfile(res.data.profile);
//       })
//       .catch((err) => console.log("No profile found yet", err));
//   }, []);

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleSave = async () => {
//     try {
//       const formData = new FormData();
//       for (let key in profile) {
//         if (profile[key] !== undefined) formData.append(key, profile[key]);
//       }
//       if (imageFile) formData.append("image", imageFile);

//       const res = await axios.post(`${BASE_URL}/admin/owner-profile`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         alert("Profile saved!");
//         setProfile(res.data.profile); // ✅ Update state with latest saved data
//         setEditMode(false);
//         setImageFile(null);
//       } else {
//         alert("Error saving profile: " + (res.data.error || "Unknown error"));
//       }
//     } catch (err) {
//       alert("Network error while saving profile");
//       console.error(err.response ? err.response.data : err);
//     }
//   };

//   return (
//     <div className="owner-profile-container">
//       <div className="owner-card">
// <img
//   src={
//     imageFile
//       ? URL.createObjectURL(imageFile)
//       : profile.image
//       ? profile.image
//       : "/default-avatar.png"
//   }
//   alt="profile"
//   className="owner-avatar"
// />
//         {editMode && <input type="file" onChange={handleFileChange} />}
//         <h2>{profile.name || "Owner Name"}</h2>
//         <p>{profile.role || "Role"}</p>
//         <p>{profile.email || "Email"}</p>
//         <p>{profile.phone || "Phone"}</p>
//         <p>{profile.location || "Location"}</p>
//         <p>Age: {profile.age || "-"}</p>
//         <p>Joined: {profile.joined || "-"}</p>
//         <p>Rating: {profile.rating || "-"}</p>
//         <p>Reviews: {profile.reviews || "-"}</p>

//         {editMode ? (
//           <div className="edit-form">
//             <input
//               type="text"
//               name="name"
//               value={profile.name || ""}
//               onChange={handleChange}
//               placeholder="Name"
//             />
//             <input
//               type="text"
//               name="role"
//               value={profile.role || ""}
//               onChange={handleChange}
//               placeholder="Role"
//             />
//             <input
//               type="email"
//               name="email"
//               value={profile.email || ""}
//               onChange={handleChange}
//               placeholder="Email"
//             />
//             <input
//               type="text"
//               name="phone"
//               value={profile.phone || ""}
//               onChange={handleChange}
//               placeholder="Phone"
//             />
//             <input
//               type="text"
//               name="location"
//               value={profile.location || ""}
//               onChange={handleChange}
//               placeholder="Location"
//             />
//             <input
//               type="number"
//               name="age"
//               value={profile.age || ""}
//               onChange={handleChange}
//               placeholder="Age"
//             />
//             <input
//               type="number"
//               step="0.1"
//               name="rating"
//               value={profile.rating || ""}
//               onChange={handleChange}
//               placeholder="Rating"
//             />
//             <input
//               type="number"
//               name="reviews"
//               value={profile.reviews || ""}
//               onChange={handleChange}
//               placeholder="Reviews"
//             />
//             <button onClick={handleSave}>Save</button>
//             <button onClick={() => setEditMode(false)}>Cancel</button>
//           </div>
//         ) : (
//           <button onClick={() => setEditMode(true)}>Edit Profile</button>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OwnerProfile.css";

// Dynamic BASE_URL
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : import.meta.env.VITE_BASE_URL;

export default function OwnerProfile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Load profile
  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/owner-profile`)
      .then((res) => {
        if (res.data.success) setProfile(res.data.profile);
      })
      .catch((err) => console.log("No profile found yet", err));
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        if (profile[key] !== undefined) formData.append(key, profile[key]);
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.post(`${BASE_URL}/admin/owner-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Profile saved!");
        setProfile(res.data.profile); // update state
        setEditMode(false);
        setImageFile(null);
      } else alert("Error: " + (res.data.error || "Unknown error"));
    } catch (err) {
      alert("Network error while saving profile");
      console.error(err.response ? err.response.data : err);
    }
  };

  // Image URL: Render + Localhost fallback
  const profileImage =
    imageFile
      ? URL.createObjectURL(imageFile)
      : profile.image
      ? profile.image.startsWith("http")
        ? profile.image
        : `${BASE_URL}${profile.image}`
      : "/default-avatar.png";

  return (
    <div className="owner-profile-container">
      <div className="owner-card">
        <img src={profileImage} alt="profile" className="owner-avatar" />
        {editMode && <input type="file" onChange={handleFileChange} />}
        <h2>{profile.name || "Owner Name"}</h2>
        <p>{profile.role || "Role"}</p>
        <p>{profile.email || "Email"}</p>
        <p>{profile.phone || "Phone"}</p>
        <p>{profile.location || "Location"}</p>
        <p>Age: {profile.age || "-"}</p>
        <p>Joined: {profile.joined || "-"}</p>
        <p>Rating: {profile.rating || "-"}</p>
        <p>Reviews: {profile.reviews || "-"}</p>

        {editMode ? (
          <div className="edit-form">
            <input type="text" name="name" value={profile.name || ""} onChange={handleChange} placeholder="Name" />
            <input type="text" name="role" value={profile.role || ""} onChange={handleChange} placeholder="Role" />
            <input type="email" name="email" value={profile.email || ""} onChange={handleChange} placeholder="Email" />
            <input type="text" name="phone" value={profile.phone || ""} onChange={handleChange} placeholder="Phone" />
            <input type="text" name="location" value={profile.location || ""} onChange={handleChange} placeholder="Location" />
            <input type="number" name="age" value={profile.age || ""} onChange={handleChange} placeholder="Age" />
            <input type="number" step="0.1" name="rating" value={profile.rating || ""} onChange={handleChange} placeholder="Rating" />
            <input type="number" name="reviews" value={profile.reviews || ""} onChange={handleChange} placeholder="Reviews" />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}