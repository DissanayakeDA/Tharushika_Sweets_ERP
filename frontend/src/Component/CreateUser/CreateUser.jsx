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
    nicNo: "",
    mobileNo: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    if (formData.password !== formData.reenterPassword) {
      return "Passwords do not match.";
    }

    // NIC validation (Sri Lankan format)
    const nicRegex = /^[0-9]{9}[vVxX]$|^[0-9]{12}$/;
    if (!nicRegex.test(formData.nicNo)) {
      return "Invalid NIC number. Use 9 digits + 'V'/'X' or 12 digits.";
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobileNo)) {
      return "Mobile number must be 10 digits.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Invalid email address.";
    }

    return null; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
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
              <option value="Sales Management">Sales Management</option>
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
            <label>NIC Number</label>
            <input
              type="text"
              name="nicNo"
              value={formData.nicNo}
              onChange={handleChange}
              required
              className="text-input"
              placeholder="e.g., 123456789V or 200012345678"
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              required
              className="text-input"
              placeholder="e.g., 0712345678"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="text-input"
              placeholder="e.g., user@example.com"
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