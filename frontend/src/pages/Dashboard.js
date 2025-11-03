import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  // Fetch all expenses from Django API
  const getExpenses = async () => {
    try {
      const res = await API.get("expenses/");
      setExpenses(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  // Delete an expense
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await API.delete(`expenses/${id}/`);
    getExpenses();
  };

  // Load data on mount
  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Your Expenses 💸</h3>

      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/add")}
      >
        + Add Expense
      </button>

      {expenses.length === 0 ? (
        <p>No expenses yet. Add some!</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount (₹)</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.title}</td>
                <td>{exp.category}</td>
                <td>{exp.amount}</td>
                <td>{exp.date}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(exp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;

