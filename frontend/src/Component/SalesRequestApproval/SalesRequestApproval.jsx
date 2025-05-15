import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SalesRequestApproval.css";
import Nav from "../Nav/Nav";

function SalesRequestApproval() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const response = await axios.get("http://localhost:5000/api/sales-requests", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.status === 200 && response.data.success) {
          setRequests(response.data.data);
        } else {
          setError("Failed to fetch sales requests.");
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

  const handleAction = async (requestId, action) => {
    setError("");
    setSuccess("");
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const response = await axios.put(
        `http://localhost:5000/api/sales-requests/${requestId}/status`,
        { status: action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200 && response.data.success) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: action } : req
          )
        );
        setSuccess(`Request ${action.toLowerCase()} successfully!`);
      } else {
        setError(`Failed to ${action.toLowerCase()} request.`);
      }
    } catch (err) {
      setError(`Server error while ${action.toLowerCase()} request.`);
      console.error(`Error ${action.toLowerCase()} request:`, err);
    }
  };

  return (
    <div className="sales-requests-approval-container">
      <Nav />
      <div className="sales-requests-approval-main-content">
        <div className="sales-requests-approval-content-wrapper">
          <h2 className="sales-requests-approval-title">Sales Requests Approval</h2>
          {isLoading ? (
            <div className="sales-requests-approval-loading-spinner">
              <div className="sales-requests-approval-spinner"></div>
              <p>Loading requests...</p>
            </div>
          ) : (
            <div className="sales-requests-approval-table-container">
              {error && <p className="sales-requests-approval-error-message">{error}</p>}
              {success && <p className="sales-requests-approval-success-message">{success}</p>}
              {requests.length === 0 ? (
                <p className="sales-requests-approval-no-data">No sales requests available.</p>
              ) : (
                <table className="sales-requests-approval-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Product Name</th>
                      <th>Requested Quantity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request._id}>
                        <td>{request._id}</td>
                        <td>{request.product_name}</td>
                        <td>{request.requested_quantity}</td>
                        <td className={`status-${request.status.toLowerCase()}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </td>
                        <td>
                          {request.status === "Pending" && (
                            <div className="sales-requests-approval-actions">
                              <button
                                className="sales-requests-approval-approve-btn"
                                onClick={() => handleAction(request._id, "Approved")}
                              >
                                Approve
                              </button>
                              <button
                                className="sales-requests-approval-reject-btn"
                                onClick={() => handleAction(request._id, "Rejected")}
                              >
                                Reject
                              </button>
                            </div>
                          )}
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
  );
}

export default SalesRequestApproval;