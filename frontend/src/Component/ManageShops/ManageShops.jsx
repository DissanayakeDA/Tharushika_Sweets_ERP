import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./ManageShops.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function ManageShops() {
  const [shops, setShops] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingShop, setEditingShop] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Filter shops based on search query
  const filteredShops = shops.filter(
    (shop) =>
      shop.buyername.toLowerCase().includes(searchQuery) ||
      shop.shopname.toLowerCase().includes(searchQuery)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (shopId) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/indirectbuyers/${shopId}`
        );
        if (response.data.success) {
          setShops(shops.filter((shop) => shop._id !== shopId));
          setMessage("Shop deleted successfully");
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (err) {
        setError("Error deleting shop");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  // Validation function
  const validateForm = (shop) => {
    const errors = {};
    if (!shop.buyername.trim()) {
      errors.buyername = "Buyer name is required";
    }
    if (!shop.shopname.trim()) {
      errors.shopname = "Shop name is required";
    }
    if (!shop.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(shop.contact)) {
      errors.contact = "Contact number must be 10 digits";
    }
    if (!shop.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shop.email)) {
      errors.email = "Invalid email format";
    }
    if (!shop.address.trim()) {
      errors.address = "Address is required";
    }
    return errors;
  };

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setValidationErrors({});
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(editingShop);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/indirectbuyers/${editingShop._id}`,
        editingShop
      );
      if (response.data.success) {
        setShops(
          shops.map((shop) =>
            shop._id === editingShop._id ? response.data.data : shop
          )
        );
        setShowEditModal(false);
        setMessage("Shop updated successfully");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError("Error updating shop");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="manageshops-container">
      <HeadBar />
      <SalesNav />
      <div className="manageshops-main-content">
        <div className="manageshops-header">
          <h2 className="manageshops-title">Manage Shops (Indirect Buyers)</h2>
          <Link to="/addshops" className="manageshops-new-shop-btn">
            Add New Shop
          </Link>
        </div>

        {message && <p className="manageshops-success-message">{message}</p>}
        {error && <p className="manageshops-error-message">{error}</p>}

        <div className="manageshops-search-container">
          <input
            type="text"
            placeholder="Search by buyer name or shop name..."
            value={searchQuery}
            onChange={handleSearch}
            className="manageshops-search-input"
          />
        </div>

        <div className="manageshops-results-summary">
          <span>
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredShops.length)} of{" "}
            {filteredShops.length} shops
          </span>
          <div className="manageshops-items-per-page">
            <span>Items per page:</span>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="manageshops-table-container">
          <table className="manageshops-table">
            <thead>
              <tr>
                <th>Buyer Name</th>
                <th>Shop Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentShops.length === 0 ? (
                <tr>
                  <td colSpan="6" className="manageshops-no-data">
                    No shops found
                  </td>
                </tr>
              ) : (
                currentShops.map((shop) => (
                  <tr key={shop._id}>
                    <td>{shop.buyername}</td>
                    <td>{shop.shopname}</td>
                    <td>{shop.contact}</td>
                    <td>{shop.email}</td>
                    <td>{shop.address}</td>
                    <td>
                      <div className="manageshops-actions">
                        <button
                          className="manageshops-edit-btn"
                          onClick={() => handleEdit(shop)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="manageshops-delete-btn"
                          onClick={() => handleDelete(shop._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="manageshops-pagination-controls">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="manageshops-pagedetails">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Last
          </button>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="manageshops-modal">
            <div className="manageshops-modal-content">
              <div className="manageshops-modal-header">
                <h3>Edit Shop Details</h3>
                <button
                  className="manageshops-modal-close"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>
              <form
                onSubmit={handleEditSubmit}
                className="manageshops-edit-form"
              >
                <div className="manageshops-form-group">
                  <label htmlFor="buyername">
                    Buyer Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="buyername"
                    value={editingShop.buyername}
                    onChange={(e) =>
                      setEditingShop({
                        ...editingShop,
                        buyername: e.target.value,
                      })
                    }
                    className={validationErrors.buyername ? "error" : ""}
                  />
                  {validationErrors.buyername && (
                    <span className="error-message">
                      {validationErrors.buyername}
                    </span>
                  )}
                </div>
                <div className="manageshops-form-group">
                  <label htmlFor="shopname">
                    Shop Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="shopname"
                    value={editingShop.shopname}
                    onChange={(e) =>
                      setEditingShop({
                        ...editingShop,
                        shopname: e.target.value,
                      })
                    }
                    className={validationErrors.shopname ? "error" : ""}
                  />
                  {validationErrors.shopname && (
                    <span className="error-message">
                      {validationErrors.shopname}
                    </span>
                  )}
                </div>
                <div className="manageshops-form-group">
                  <label htmlFor="contact">
                    Contact Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact"
                    value={editingShop.contact}
                    onChange={(e) =>
                      setEditingShop({
                        ...editingShop,
                        contact: e.target.value,
                      })
                    }
                    className={validationErrors.contact ? "error" : ""}
                    placeholder="10 digits"
                  />
                  {validationErrors.contact && (
                    <span className="error-message">
                      {validationErrors.contact}
                    </span>
                  )}
                </div>
                <div className="manageshops-form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={editingShop.email}
                    onChange={(e) =>
                      setEditingShop({ ...editingShop, email: e.target.value })
                    }
                    className={validationErrors.email ? "error" : ""}
                  />
                  {validationErrors.email && (
                    <span className="error-message">
                      {validationErrors.email}
                    </span>
                  )}
                </div>
                <div className="manageshops-form-group">
                  <label htmlFor="address">
                    Address <span className="required">*</span>
                  </label>
                  <textarea
                    id="address"
                    value={editingShop.address}
                    onChange={(e) =>
                      setEditingShop({
                        ...editingShop,
                        address: e.target.value,
                      })
                    }
                    className={validationErrors.address ? "error" : ""}
                    rows="4"
                  />
                  {validationErrors.address && (
                    <span className="error-message">
                      {validationErrors.address}
                    </span>
                  )}
                </div>
                <div className="manageshops-modal-buttons">
                  <button
                    type="button"
                    className="manageshops-cancel-btn"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="manageshops-save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageShops;
