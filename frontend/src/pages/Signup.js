import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("register/", form);
      alert("Signup successful!");
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="col-md-4 mx-auto mt-5">
      <h3>Signup</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          className="form-control mb-3"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button className="btn btn-primary w-100">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
