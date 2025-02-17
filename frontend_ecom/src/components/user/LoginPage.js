import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Error from "../ui/Error";

const Loginpage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(username, password, userType);
      navigate(localStorage.getItem("usertype") === "vendor" ? "/vendor_dashboard" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center m-5 vh-75">
      <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
        {error && <Error error={error} />}
        <h2 className="text-center fw-bold text-primary">Welcome Back</h2>
        <p className="text-center text-muted">Please login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">User Name:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username..."
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="user_type" className="form-label">User Type:</label>
            <select
              className="form-select"
              id="user_type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p><a href="/reset_key" className="text-decoration-none">Forgot password?</a></p>
          <p>Don't have an account? <Link to="/register" className="text-decoration-none">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
