import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || "Failed to process request.");
      }
    } catch (error) {
      console.error("Error during forgot password request:", error);
      setError(error.response?.data?.message || "Error processing request.");
    }
  };

  return (
    <div className="forgot-password-container">
      <HeadBar />
      <div className="forgot-password-content">
        <h2 className="forgot-password-title">Forgot Password</h2>
        {error && <p className="error-text">{error}</p>}
        {success && (
          <p className="success-text">
            If an account exists with this email, you will receive password
            reset instructions.
          </p>
        )}
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-input"
              placeholder="Enter your registered email"
            />
          </div>
          <button type="submit" className="submit-btn">
            Reset Password
          </button>
        </form>
        <Link to="/login" className="back-to-login">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
