import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function AddExpense() {
  const [form, setForm] = useState({ title: "", amount: "", category: "Food" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("expenses/", form);
      alert("Expense added!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to add expense!");
    }
  };

  return (
    <div className="col-md-5 mx-auto mt-5">
      <h3>Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          className="form-control mb-3"
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <select
          className="form-control mb-3"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Other</option>
        </select>
        <button className="btn btn-success w-100">Add Expense</button>
      </form>
    </div>
  );
}

export default AddExpense;
