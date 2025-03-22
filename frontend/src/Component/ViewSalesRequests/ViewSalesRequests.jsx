import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./ViewSalesRequests.css";
import axios from "axios";
import HeadBar from "../HeadBar/HeadBar";

function ViewSalesRequests() {
  const [salesRequests, setSalesRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/sales-requests");
      if (response.data.success) {
        setSalesRequests(response.data.data);
      } else {
        setError("Failed to fetch sales requests.");
      }
    } catch (error) {
      console.error("Error fetching sales requests:", error);
      setError("Error fetching sales requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/sales-requests/${id}/status`, { status });
      if (response.data.success) {
        setSalesRequests((prev) =>
          prev.map((req) => (req._id === id ? response.data.data : req))
        );
        alert(`Sales request ${status} successfully!`);
      } else {
        alert("Failed to update sales request: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating sales request:", error.response?.data?.message || error.message);
      alert("Failed to update sales request.");
    }
  };

  return (
    <div className="view-sales-requests-container">
      <HeadBar />
      <Nav />
      <h2 className="title-view-sales">View Sales Requests</h2>

      {loading && <p>Loading sales requests...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="sales-requests-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Requested At</th>
            <th>Items</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesRequests.map((request) => (
            <tr key={request._id}>
              <td>{request._id}</td>
              <td>{new Date(request.requestedAt).toLocaleString()}</td>
              <td>
                <ul>
                  {request.items.map((item, index) => (
                    <li key={index}>
                      {item.product_name} - Qty: {item.quantity} - Price: {item.price}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{request.status}</td>
              <td>
                {request.status === "pending" && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() => handleStatusUpdate(request._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusUpdate(request._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewSalesRequests;