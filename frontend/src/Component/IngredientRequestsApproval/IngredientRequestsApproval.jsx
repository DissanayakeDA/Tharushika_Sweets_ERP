import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IngredientRequestsApproval.css";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import SalesRequestApproval from "../SalesRequestApproval/SalesRequestApproval";

function IngredientRequestsApproval() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSalesRequests, setShowSalesRequests] = useState(false);

  useEffect(() => {
    if (!showSalesRequests) {
      const fetchRequests = async () => {
        try {
          const user = JSON.parse(sessionStorage.getItem("user"));
          const response = await axios.get("http://localhost:5000/api/ingredient-requests", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          });
          if (response.status === 200 && response.data.success) {
            setRequests(response.data.data);
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
    }
  }, [showSalesRequests]);

  const handleAction = async (requestId, action) => {
    setError("");
    setSuccess("");
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const response = await axios.patch(
        `http://localhost:5000/api/ingredient-requests/${requestId}`,
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
        setSuccess(`Request ${action} successfully!`);
      } else {
        setError(`Failed to ${action} request.`);
      }
    } catch (err) {
      setError(`Server error while ${action} request.`);
      console.error(`Error ${action} request:`, err);
    }
  };

  const handleDropdownChange = (event) => {
    setShowSalesRequests(event.target.value === "sales");
  };

  return (
    <div className="ingredient-requests-approval-container">
      <HeadBar />
      <Nav />
      <div className="ingredient-requests-approval-main-content">
        <div className="ingredient-requests-approval-content-wrapper">
          <div className="dropdown-container">
            <select
              className="request-type-dropdown"
              value={showSalesRequests ? "sales" : "ingredient"}
              onChange={handleDropdownChange}
            >
              <option value="ingredient">Ingredient Requests</option>
              <option value="sales">Sales Requests</option>
            </select>
          </div>
          {showSalesRequests ? (
            <SalesRequestApproval />
          ) : (
            <>
              <h2 className="ingredient-requests-approval-title">Ingredient Requests Approval</h2>
              {isLoading ? (
                <div className="ingredient-requests-approval-loading-spinner">
                  <div className="ingredient-requests-approval-spinner"></div>
                  <p>Loading requests...</p>
                </div>
              ) : (
                <div className="ingredient-requests-approval-table-container">
                  {error && <p className="ingredient-requests-approval-error-message">{error}</p>}
                  {success && <p className="ingredient-requests-approval-success-message">{success}</p>}
                  {requests.length === 0 ? (
                    <p className="ingredient-requests-approval-no-data">No ingredient requests available.</p>
                  ) : (
                    <table className="ingredient-requests-approval-table">
                      <thead>
                        <tr>
                          <th>Request ID</th>
                          <th>Ingredient Name</th>
                          <th>Requested Quantity</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => (
                          <tr key={request._id}>
                            <td>{request._id}</td>
                            <td>{request.ingredient_id?.ingredient_name || "Unknown"}</td>
                            <td>{request.request_quantity}</td>
                            <td className={`status-${request.status}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </td>
                            <td>
                              {request.status === "pending" && (
                                <div className="ingredient-requests-approval-actions">
                                  <button
                                    className="ingredient-requests-approval-approve-btn"
                                    onClick={() => handleAction(request._id, "approved")}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="ingredient-requests-approval-reject-btn"
                                    onClick={() => handleAction(request._id, "rejected")}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default IngredientRequestsApproval;