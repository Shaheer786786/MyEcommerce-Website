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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/profile");
    } catch (err) {
      alert(
        "Login failed: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const handleForgotPassword = async () => {
    if (!form.email) {
      alert("Please enter your email first");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/auth/forgot-password`, {
        email: form.email,
      });

      alert("Password reset link sent to your email");
    } catch (err) {
      alert(
        "Error: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="forgot-password">
          <span onClick={handleForgotPassword}>
            Forgot Password?
          </span>
        </div>

        <div className="auth-link">
          New user?{" "}
          <span onClick={() => navigate("/signup")}>
            Create account
          </span>
        </div>
      </div>
    </div>
  );
}