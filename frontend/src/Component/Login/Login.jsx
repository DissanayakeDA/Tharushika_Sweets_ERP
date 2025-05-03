import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Update this with your actual login illustration
import LoginImage from "../images/login-bg.svg";
import axios from "axios";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      if (response.data.success) {
        sessionStorage.setItem("user", JSON.stringify(response.data.data));

        // Simulate a delay for loading effect
        setTimeout(() => {
          const { accessLevel } = response.data.data;
          switch (accessLevel) {
            case "Executive":
              navigate("/home-gm");
              break;
            case "Employee Management":
              navigate("/hrdashboard");
              break;
            case "Production Management":
              navigate("/productiondashboard");
              break;
            case "Sales Management":
              navigate("/salesdashboard");
              break;
            case "Stock Management":
              navigate("/mainhome");
              break;
            default:
              setError("Unknown access level");
              setIsLoading(false);
          }
        }, 1000);
      } else {
        setError(response.data.message || "Login failed.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.response?.data?.message || "Error during login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-image-container">
          <img src={LoginImage} alt="Login" className="login-image" />
        </div>

        <div className="login-form-container">
          <div className="company-info">
            <p className="company-tagline">Advanced ERP simplified.</p>
            <p className="company-name">Kyndex Labs (Pvt) Ltd</p>
            <p className="company-version">Version 66.8</p>
          </div>

          <h2 className="login-title">Sign In</h2>

          {error && (
            <div className="error-container">
              <p className="error-text">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form-bg">
            <div className="form-group-login">
              <div className="input-wrapper-lg">
                <i className="input-icon user-icon"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="text-input-login"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="form-group-login">
              <div className="input-wrapper-lg">
                <i className="input-icon password-icon"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="text-input-login"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? <span className="loader"></span> : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
