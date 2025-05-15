import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HRNav from "../HRNav/HRNav";
import GMNav from "../GMNav/GMNav"; // Import GMNav
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./AccessControlDashboard.css";

function AccessControlDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(sessionStorage.getItem("user")) || {};
  const isExecutive = currentUser.accessLevel === "Executive";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.response?.data?.message || "Error fetching users.");
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/users/${userToDelete}`
        );
        if (response.data.success) {
          setUsers((prev) => prev.filter((user) => user._id !== userToDelete));
          setShowModal(false);
          setUserToDelete(null);
        } else {
          setError(response.data.message || "Failed to delete user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.response?.data?.message || "Error deleting user.");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const handleCreateAccess = () => {
    navigate("/create-user");
  };

  return (
    <div className="dashboard-container">
      {isExecutive ? <GMNav /> : <HRNav />}{" "}
      {/* Conditionally render GMNav or HRNav */}
      <HeadBar />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Access Control Dashboard</h2>
        {error && <p className="error-text">{error}</p>}
        <button className="create-btn" onClick={handleCreateAccess}>
          Create Access
        </button>
        <div className="user-list">
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => (
              <div key={user._id} className="user-row">
                <span className="user-info">
                  {user.employeeName} ({user.username}) - {user.accessLevel}
                </span>
                {isExecutive && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(user._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Custom Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Deletion</h3>
            <p className="modal-message">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="modal-buttons">
              <button className="modal-cancel-btn" onClick={handleModalClose}>
                Cancel
              </button>
              <button
                className="modal-confirm-btn"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessControlDashboard;
