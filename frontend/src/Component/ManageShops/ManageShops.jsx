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

  // Fetch all shops on component mount
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/indirectbuyers/");
      if (response.data.success) {
        setShops(response.data.data);
      }
    } catch (err) {
      setError("Error fetching shops");
    }
  };

  const handleEdit = (shop) => {
    setEditingId(shop._id);
    setFormData({
      buyername: shop.buyername,
      shopname: shop.shopname,
      contact: shop.contact,
      address: shop.address,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/indirectbuyers/${id}`, formData);
      if (response.data.success) {
        setShops(shops.map((shop) => (shop._id === id ? response.data.data : shop)));
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
      const response = await axios.delete(`http://localhost:5000/api/indirectbuyers/${id}`);
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
                    <input
                      type="text"
                      name="shopname"
                      value={formData.shopname}
                      onChange={handleChange}
                      placeholder="Shop Name"
                    />
                    <input
                      type="number"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="Contact"
                    />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Address"
                    />
                    <div className="edit-actions">
                      <button className="save-btn" onClick={() => handleUpdate(shop._id)}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="shop-details">
                    <p><strong>Buyer:</strong> {shop.buyername}</p>
                    <p><strong>Shop:</strong> {shop.shopname}</p>
                    <p><strong>Contact:</strong> {shop.contact}</p>
                    <p><strong>Address:</strong> {shop.address}</p>
                    <div className="shop-actions">
                      <button className="edit-btn" onClick={() => handleEdit(shop)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => setShowDeleteConfirm(shop._id)}>
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