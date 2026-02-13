import { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";

import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/auth/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send reset link");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        {message && <p className="message">{message}</p>}
        <input placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}/>
        <button onClick={handleSubmit}>Send Reset Link</button>
      </div>
    </div>
  );
}
