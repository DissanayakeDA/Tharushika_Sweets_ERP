import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      if (response.data.success) {
        sessionStorage.setItem("user", JSON.stringify(response.data.data));

        const { accessLevel } = response.data.data;
        switch (accessLevel) {
          case "Executive":
            navigate("/Accessdashboard");
            break;
          case "Employee Management":
            navigate("/hrdashboard");
            break;
          case "Production Management":
            navigate("/productiondashboard");
            break;
          case "Supply Management":
            navigate("/supplydashboard");
            break;
          case "Stock Management":
            navigate("/stockdashboard");
            break;
          default:
            setError("Unknown access level");
        }
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.response?.data?.message || "Error during login.");
    }
  };

  return (
    <div className="login-container">
      <HeadBar />
      <h1 className="workflow-title">Workflow Management Center</h1> {/* Added here */}
      <div className="login-content">
        <h2 className="login-title">Login</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="text-input"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="text-input"
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}

export default Login;