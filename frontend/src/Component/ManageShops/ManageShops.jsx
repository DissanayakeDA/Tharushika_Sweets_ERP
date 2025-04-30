import React, { useState, useEffect } from "react";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./ManageShops.css";
import axios from "axios";

function ManageShops() {
  const [shops, setShops] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [validationErrors, setValidationErrors] = useState({}); // Added state for validation errors

  // Fetch all shops on component mount
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/indirectbuyers/"
      );
      if (response.data.success) {
        setShops(response.data.data);
      }
    } catch (err) {
      setError("Error fetching shops");
    }
  };

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

  const handleEdit = (shop) => {
    setEditingId(shop._id);
    setFormData({
      buyername: shop.buyername,
      shopname: shop.shopname,
      contact: shop.contact,
      address: shop.address,
    });
    setValidationErrors({}); // Clear validation errors when starting to edit
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (id) => {
    // Validate form data before proceeding with the update
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/indirectbuyers/${id}`,
        formData
      );
      if (response.data.success) {
        setShops(
          shops.map((shop) => (shop._id === id ? response.data.data : shop))
        );
        setEditingId(null);
        setMessage("Shop updated successfully!");
        setError("");
      }
    } catch (err) {
      setError("Error updating shop");
      setMessage("");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/indirectbuyers/${id}`
      );
      if (response.data.success) {
        setShops(shops.filter((shop) => shop._id !== id));
        setMessage("Shop deleted successfully!");
        setError("");
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      setError("Error deleting shop");
      setMessage("");
    }
  };

  return (
    <div className="manage-shops-container">
      <HeadBar />
      <SalesNav />
      <div className="main-content">
        <h2 className="manage-shops-title">Manage Shops (Indirect Buyers)</h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="shops-list">
          {shops.length === 0 ? (
            <p>No shops found</p>
          ) : (
            shops.map((shop) => (
              <div key={shop._id} className="shop-card">
                {editingId === shop._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      name="buyername"
                      value={formData.buyername}
                      onChange={handleChange}
                      placeholder="Buyer Name"
                    />
                    {validationErrors.buyername && (
                      <p className="error-message">
                        {validationErrors.buyername}
                      </p>
                    )}
                    <input
                      type="text"
                      name="shopname"
                      value={formData.shopname}
                      onChange={handleChange}
                      placeholder="Shop Name"
                    />
                    {validationErrors.shopname && (
                      <p className="error-message">
                        {validationErrors.shopname}
                      </p>
                    )}
                    <input
                      type="text" // Changed from type="number" to type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="Contact"
                    />
                    {validationErrors.contact && (
                      <p className="error-message">
                        {validationErrors.contact}
                      </p>
                    )}
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                    />
                    {validationErrors.address && (
                      <p className="error-message">
                        {validationErrors.address}
                      </p>
                    )}
                    <div className="edit-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleUpdate(shop._id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="shop-details">
                    <p>
                      <strong>Buyer:</strong> {shop.buyername}
                    </p>
                    <p>
                      <strong>Shop:</strong> {shop.shopname}
                    </p>
                    <p>
                      <strong>Contact:</strong> {shop.contact}
                    </p>
                    <p>
                      <strong>Address:</strong> {shop.address}
                    </p>
                    <div className="shop-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(shop)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => setShowDeleteConfirm(shop._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {showDeleteConfirm && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-box">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this shop?</p>
              <p>This action cannot be undone.</p>
              <div className="confirm-buttons">
                <button
                  className="confirm-delete-btn"
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  Yes, Delete
                </button>
                <button
                  className="cancel-delete-btn"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageShops;
