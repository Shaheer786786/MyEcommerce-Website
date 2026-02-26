import { useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/auth/forgot-password`,
        { email }
      );

      setMessage(res.data.message || "Password reset link sent to your email.");

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

      </div>
    </div>
  );
}