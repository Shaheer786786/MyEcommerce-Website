import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/auth/signup", form);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})} />
      <button type="submit">Signup</button>
    </form>
  );
}
