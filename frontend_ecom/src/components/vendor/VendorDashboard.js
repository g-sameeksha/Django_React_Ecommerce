import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../../utils/api";

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    api
      .get("/vendor", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => console.error("Error fetching dashboard data:", error));
  }, []);

  if (!dashboardData)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h4>Loading Dashboard...</h4>
        </div>
      </div>
    );

  return (
    <div className="container mt-4">
      {/* Dashboard Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Vendor Dashboard</h2>
        <Link to="/add_product" className="btn btn-success">
          + Add New Product
        </Link>
      </div>

      {/* Statistics Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow p-3 text-center">
            <h5 className="text-muted">Total Products</h5>
            <h2 className="text-dark">{dashboardData.total_products}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3 text-center">
            <h5 className="text-muted">Total Sales</h5>
            <h2 className="text-success">{dashboardData.total_sales}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow p-3 text-center">
            <h5 className="text-muted">Total Revenue</h5>
            <h2 className="text-primary">₹{dashboardData.total_revenue}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row">
        {/* Top Selling Products */}
        <div className="col-md-6 mb-4">
          <div className="card shadow p-3">
            <h4 className="text-center text-secondary">Top Selling Products</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.top_selling_products}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_sold" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales Trend */}
        <div className="col-md-6 mb-4">
          <div className="card shadow p-3">
            <h4 className="text-center text-secondary">Monthly Sales Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.monthly_sales}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_revenue" stroke="#28a745" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow p-3">
            <h4 className="text-center text-secondary">Stock Status</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dashboardData.stock_status} dataKey="stock" nameKey="name" fill="#17a2b8" label>
                  {dashboardData.stock_status.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={["#FF8042", "#0088FE", "#00C49F", "#FFBB28"][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
