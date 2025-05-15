import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      setError(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          newPassword: formData.newPassword,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError(error.response?.data?.message || "Error processing request.");
    }
  };

  return (
    <div className="reset-password-container">
      <HeadBar />
      <div className="reset-password-content">
        <h2 className="reset-password-title">Reset Password</h2>
        {error && <p className="error-text">{error}</p>}
        {success && (
          <p className="success-text">
            Password has been reset successfully. Redirecting to login...
          </p>
        )}
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="text-input"
              placeholder="Enter new password"
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="text-input"
              placeholder="Confirm new password"
            />
          </div>
          <button type="submit" className="submit-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
