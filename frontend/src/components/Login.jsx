// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Auth.css";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://127.0.0.1:5000/auth/login", form);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/profile"); // login ke baad Profile page
//     } catch (err) {
//       alert("Login failed: " + (err.response?.data?.message || err.message));
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2>Login</h2>

//         <input
//           placeholder="Email"
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />

//         <button onClick={handleSubmit}>Login</button>

//         <div className="auth-link">
//           New user?{" "}
//           <span onClick={() => navigate("/signup")}>Create account</span>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.
      // post("http://127.0.0.1:5000/auth/login", form);
                  post(`${BASE_URL}/auth/login`,form);


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/profile");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleSubmit}>Login</button>

        <div className="auth-link">
          New user?{" "}
          <span onClick={() => navigate("/signup")}>Create account</span>
        </div>
      </div>
    </div>
  );
}