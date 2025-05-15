import React, { useState, useEffect } from "react";
import "./ViewIngredientRequests.css";
import PMNav from "../PMNav/PMNav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import { jsPDF } from "jspdf";

function ViewIngredientRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const response = await axios.get(
          "http://localhost:5000/api/ingredient-requests",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.status === 200 && response.data.success) {
          // Sort by date initially (newest first)
          const sortedData = response.data.data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRequests(sortedData);
          setFilteredRequests(sortedData);
        } else {
          setError("Failed to fetch ingredient requests.");
        }
      } catch (err) {
        setError("Server error while fetching requests.");
        console.error("Error fetching requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    // Filter and then sort the data
    let filtered = requests.filter((request) =>
      request._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.ingredient_id?.ingredient_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting
    if (sortOrder === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredRequests(filtered);
  }, [searchQuery, requests, sortOrder]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  const handleDownload = (request) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Ingredient Request Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Request ID: ${request._id}`, 20, 40);
    doc.text(`Ingredient Name: ${request.ingredient_id?.ingredient_name || "Unknown"}`, 20, 50);
    doc.text(`Requested Quantity: ${request.request_quantity}`, 20, 60);
    doc.text(`Status: ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}`, 20, 70);
    doc.text(`Created At: ${new Date(request.createdAt).toLocaleDateString()}`, 20, 80);
    doc.save(`ingredient_request_${request._id}.pdf`);
  };

  const handleDeleteClick = (request) => {
    if (request.status === "pending") {
      setRequestToDelete(request);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const response = await axios.delete(
        `http://localhost:5000/api/ingredient-requests/${requestToDelete._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setRequests(requests.filter((req) => req._id !== requestToDelete._id));
        setSuccess("Request deleted successfully!");
        setShowDeleteModal(false);
        setRequestToDelete(null);
      } else {
        setError("Failed to delete request.");
      }
    } catch (err) {
      setError("Server error while deleting request.");
      console.error("Error deleting request:", err);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRequestToDelete(null);
  };

  return (
    <div className="view-ingredient-requests-container">
      <HeadBar />
      <div className="view-ingredient-requests-layout">
        <div className="view-ingredient-requests-sidebar">
          <PMNav />
        </div>
        <div className="view-ingredient-requests-main-content">
          <div className="view-ingredient-requests-content-wrapper">
            <h2 className="view-ingredient-requests-title">My Ingredient Requests</h2>
            <div className="search-and-sort-container">
              <div className="search-bar-container">
                <input
                  type="text"
                  className="search-bar-input"
                  placeholder="Search by ID or ingredient name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="sort-container">
                <button className="sort-button" onClick={toggleSortOrder}>
                  {sortOrder === "newest" ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="sort-icon"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                      </svg>
                      Newest First
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="sort-icon"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.5 3.793V2.5a.5.5 0 0 0-1 0v1.293L1.354 2.646a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L3.5 3.793zm-3 5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5zm0-3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11a.5.5 0 0 0-.5.5zm0-3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11a.5.5 0 0 0-.5.5zm0 9a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z" />
                      </svg>
                      Oldest First
                    </>
                  )}
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="view-ingredient-requests-loading-spinner">
                <div className="view-ingredient-requests-spinner"></div>
                <p>Loading requests...</p>
              </div>
            ) : (
              <div className="view-ingredient-requests-table-container">
                {error && <p className="view-ingredient-requests-error-message">{error}</p>}
                {success && <p className="view-ingredient-requests-success-message">{success}</p>}
                {filteredRequests.length === 0 ? (
                  <p className="view-ingredient-requests-no-data">No ingredient requests found.</p>
                ) : (
                  <table className="view-ingredient-requests-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Ingredient Name</th>
                        <th>Requested Quantity</th>
                        <th>Status</th>
                        <th>Requested At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr key={request._id}>
                          <td>{request._id}</td>
                          <td>{request.ingredient_id?.ingredient_name}</td>
                          <td>{request.request_quantity}</td>
                          <td className={`status-${request.status.toLowerCase()}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </td>
                          <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="download-btn"
                                onClick={() => handleDownload(request)}
                              >
                                Download
                              </button>
                              {request.status === "pending" && (
                                <button
                                  className="delete-btn"
                                  onClick={() => handleDeleteClick(request)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this ingredient request?</p>
            <div className="delete-modal-buttons">
              <button className="delete-modal-cancel" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button className="delete-modal-confirm" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewIngredientRequests;