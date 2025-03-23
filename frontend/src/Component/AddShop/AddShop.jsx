import React, { useState } from "react";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./AddShop.css";
import axios from "axios";

function AddShop() {
  const [formData, setFormData] = useState({
    buyername: "",
    shopname: "",
    contact: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/indirectbuyers/", formData);
      if (response.data.success) {
        setMessage("Shop added successfully!");
        setError("");
        setFormData({
          buyername: "",
          shopname: "",
          contact: "",
          address: "",
        });
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
              required
              placeholder="Enter buyer name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="shopname">Shop Name</label>
            <input
              type="text"
              id="shopname"
              name="shopname"
              value={formData.shopname}
              onChange={handleChange}
              required
              placeholder="Enter shop name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input
              type="number"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="Enter contact number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter shop address"
            />
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