import React, { useState, useEffect } from "react";
import GMNav from "../GMNav/GMNav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AllStockRequestsApproval.css";

function AllStockRequestsApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  // Fetch all stock change requests and their product names
  const fetchAllRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/stock-change-requests/pending"
      );

      if (response.data.success) {
        const requestsData = response.data.data;

        // Fetch all stock product names in parallel
        const enrichedRequests = await Promise.all(
          requestsData.map(async (req) => {
            try {
              const stockRes = await axios.get(
                `http://localhost:5000/api/stocks/${req.stock_id}`
              );
              const productName = stockRes.data?.data?.product_name || "N/A";
              return { ...req, product_name: productName };
            } catch (err) {
              console.error(
                `Error fetching product for stock_id ${req.stock_id}:`,
                err
              );
              return { ...req, product_name: "N/A" };
            }
          })
        );

        setRequests(enrichedRequests);
      }
    } catch (error) {
      console.error("Error fetching stock change requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [navigate, user]);

  // Handle status update (approve/reject)
  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/stock-change-requests/${id}/status`,
        { status, reviewed_by: user.username }
      );
      if (response.data.success) {
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status } : req))
        );
        alert(`Request ${status.toLowerCase()} successfully!`);
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      alert(
        `Failed to update request: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <div className="all-requests-container">
      <HeadBar />
      <GMNav />
      <h2 className="title-all-requests">All Stock Change Requests</h2>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Request Type</th>
              <th>Proposed Value</th>
              <th>Reason</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.product_name || "N/A"}</td>
                <td>{request.request_type}</td>
                <td>
                  {request.request_type === "update"
                    ? request.proposed_changes?.product_quantity ?? "N/A"
                    : "N/A"}
                </td>
                <td>{request.reason}</td>
                <td>{request.created_by}</td>
                <td>{request.status}</td>
                <td>{new Date(request.createdAt).toLocaleString()}</td>
                <td>
                  {request.status === "Pending" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() =>
                          handleStatusUpdate(request._id, "Approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleStatusUpdate(request._id, "Rejected")
                        }
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
      )}
    </div>
  );
}

export default AllStockRequestsApproval;
