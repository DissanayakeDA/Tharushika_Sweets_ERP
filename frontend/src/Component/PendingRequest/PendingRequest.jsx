import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";

function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token"); // Replace with actual token storage

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/stock-requests/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        setError("Failed to fetch requests");
      }
    } catch (error) {
      setError("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/stock-requests/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert("Request accepted");
        fetchRequests();
      }
    } catch (error) {
      alert("Error accepting request");
    }
  };

  const handleDeny = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/stock-requests/${id}/deny`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert("Request denied");
        fetchRequests();
      }
    } catch (error) {
      alert("Error denying request");
    }
  };

  return (
    <div>
      <Nav />
      <HeadBar />
      <div className="view-stock-container">
        <h2>Pending Stock Requests</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <table className="view-stock-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Stock Name</th>
              <th>Proposed Changes</th>
              <th>Reason</th>
              <th>Requested By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.type}</td>
                <td>{request.stockId.product_name}</td>
                <td>
                  {request.type === "update"
                    ? JSON.stringify(request.proposedChanges)
                    : "N/A"}
                </td>
                <td>{request.reason}</td>
                <td>{request.requestedBy.username}</td>
                <td>
                  <button onClick={() => handleAccept(request._id)}>
                    Accept
                  </button>
                  <button onClick={() => handleDeny(request._id)}>Deny</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingRequests;
