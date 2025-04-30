import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyStockChangeRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  // Fetch user's stock change requests
  const fetchUserRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/stock-change-requests/my-requests?created_by=${user.username}`
      );
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stock change requests:", error);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [navigate, user]);

  // Delete a request
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/stock-change-requests/${id}`
        );
        if (response.data.success) {
          setRequests(requests.filter((req) => req._id !== id));
          alert("Request deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        alert(
          `Failed to delete request: ${
            error.response ? error.response.data.message : error.message
          }`
        );
      }
    }
  };

  return (
    <div className="my-requests-container">
      <HeadBar />
      <Nav />
      <h2 className="title-my-requests">My Stock Change Requests</h2>

      <table className="requests-table">
        <thead>
          <tr>
            <th>Stock ID</th>
            <th>Request Type</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.stock_id}</td>
              <td>{request.request_type}</td>
              <td>{request.reason}</td>
              <td>{request.status}</td>
              <td>{new Date(request.createdAt).toLocaleString()}</td>
              <td>
                {request.status === "Pending" && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(request._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyStockChangeRequests;
