import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await API.delete(`expenses/${id}/`);
    getExpenses();
  };

  useEffect(() => {
    getExpenses();
  }, []);

  //Total spending (proper numeric sum)
  const totalSpent = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  //Group by category
  const categoryMap = {};
  expenses.forEach((exp) => {
    const cat = exp.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(exp.amount || 0);
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  //Group by date (sort by date)
  const dateMap = {};
  expenses.forEach((exp) => {
    const date = exp.date;
    dateMap[date] = (dateMap[date] || 0) + Number(exp.amount || 0);
  });

  const dateData = Object.entries(dateMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#8dd1e1"];

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h3 className="fw-bold mb-3">Expense Dashboard 💸</h3>
        <button className="btn btn-primary" onClick={() => navigate("/add")}>
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 border-0">
            <h6>Total Spending</h6>
            <h3 className="text-primary fw-bold">
              ₹{totalSpent.toFixed(2).toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 border-0">
            <h6>Categories</h6>
            <h3 className="text-success fw-bold">{categoryData.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 border-0">
            <h6>Total Transactions</h6>
            <h3 className="text-warning fw-bold">{expenses.length}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row">
        {/* Pie Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 border-0">
            <h6 className="text-center mb-3">Expenses by Category</h6>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted">No data to show.</p>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 border-0">
            <h6 className="text-center mb-3">Spending Over Time</h6>
            {dateData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dateData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted">No data to show.</p>
            )}
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="card shadow-sm p-3 border-0 mb-5">
        <h6 className="mb-3 fw-bold">All Expenses</h6>
        {expenses.length === 0 ? (
          <p>No expenses yet. Add some!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-light">
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
                    <td>{Number(exp.amount).toFixed(2)}</td>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;




