import React, { useState } from "react";
import HRNav from "../HRNav/HRNav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateUser.css";

function CreateUser() {
  const [formData, setFormData] = useState({
    employeeName: "",
    accessLevel: "",
    username: "",
    password: "",
    reenterPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.";
    }
    if (!hasUpperCase) {
      return "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.";
    }
    if (!hasLowerCase) {
      return "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.";
    }
    if (!hasNumber) {
      return "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.";
    }
    if (!hasSpecialChar) {
      return "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.";
    }
    return null; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Check if passwords match
    if (formData.password !== formData.reenterPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password criteria
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users", formData);
      if (response.data.success) {
        navigate("/Accessdashboard");
      } else {
        setError(response.data.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error.response?.data?.message || "Error creating user.");
    }
  };

  return (
    <div className="create-user-container">
      <HRNav />
      <HeadBar />
      <div className="user-content">
        <h2 className="user-title">Create Employee Access</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              required
              className="text-input"
            />
          </div>
          <div className="form-group">
            <label>Access Level</label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              required
              className="select-input"
            >
              <option value="">Select Access Level</option>
              <option value="Supply Management">Supply Management</option>
              <option value="Production Management">Production Management</option>
              <option value="Employee Management">Employee Management</option>
              <option value="Stock Management">Stock Management</option>
            </select>
          </div>
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
          <div className="form-group">
            <label>Re-enter Password</label>
            <input
              type="password"
              name="reenterPassword"
              value={formData.reenterPassword}
              onChange={handleChange}
              required
              className="text-input"
            />
          </div>
          <button type="submit" className="submit-btn">Create User</button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;