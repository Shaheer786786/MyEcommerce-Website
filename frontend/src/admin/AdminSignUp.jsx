import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAuth.css";

function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const exists = admins.find((a) => a.email === email.trim());

    if (exists) {
      alert("Admin with this email already exists!");
      return;
    }

    const newAdmin = { email: email.trim(), password: password.trim() };
    admins.push(newAdmin);
    localStorage.setItem("admins", JSON.stringify(admins));

    alert("Signup successful! You can now login.");
    navigate("/admin/login");
  };

  return (
    <div className="admin-auth">
      <h2>Admin Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/admin/login">Login</a>
      </p>
    </div>
  );
}

export default AdminSignup;
