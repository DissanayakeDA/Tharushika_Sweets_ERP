import React, { useState } from "react";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./AddShop.css";
import axios from "axios";

function AddShop() {
  // State for form data
  const [formData, setFormData] = useState({
    buyername: "",
    shopname: "",
    contact: "",
    address: "",
  });

  // State for success message and API error
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form fields
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.buyername) {
      formErrors.buyername = "Buyer name is required.";
      isValid = false;
    }

    if (!formData.shopname) {
      formErrors.shopname = "Shop name is required.";
      isValid = false;
    }

    if (!formData.contact) {
      formErrors.contact = "Contact number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      formErrors.contact =
        "Contact number must be exactly 10 digits and contain only numbers.";
      isValid = false;
    }

    if (!formData.address) {
      formErrors.address = "Address is required.";
      isValid = false;
    }

    setValidationErrors(formErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if form is valid; if not, stop submission
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/indirectbuyers/",
        formData
      );
      if (response.data.success) {
        setMessage("Shop added successfully!");
        setError("");
        setFormData({
          buyername: "",
          shopname: "",
          contact: "",
          address: "",
        });
        setValidationErrors({}); // Clear validation errors on success
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding shop");
      setMessage("");
    }
  };

  return (
    <div className="add-shop-container">
      <HeadBar />
      <SalesNav />
      <div className="main-content">
        <h2 className="add-shop-title">Add New Shop (Indirect Buyer)</h2>

        <form className="add-shop-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="buyername">Buyer Name</label>
            <input
              type="text"
              id="buyername"
              name="buyername"
              value={formData.buyername}
              onChange={handleChange}
              placeholder="Enter buyer name"
            />
            {validationErrors.buyername && (
              <p className="error-message">{validationErrors.buyername}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="shopname">Shop Name</label>
            <input
              type="text"
              id="shopname"
              name="shopname"
              value={formData.shopname}
              onChange={handleChange}
              placeholder="Enter shop name"
            />
            {validationErrors.shopname && (
              <p className="error-message">{validationErrors.shopname}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
            {validationErrors.contact && (
              <p className="error-message">{validationErrors.contact}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter shop address"
            />
            {validationErrors.address && (
              <p className="error-message">{validationErrors.address}</p>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Add Shop
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddShop;
