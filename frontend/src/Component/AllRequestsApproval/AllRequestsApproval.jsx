import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./AllRequestsApproval.css";
import { useNavigate } from "react-router-dom";

function AllRequestsApproval() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  // Fetch all requests
  const fetchAllRequests = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/sales-requests"
      );
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [navigate, user]);

  // Handle status update (approve/reject)
  const handleStatusUpdate = async (id, status) => {
    try {
      // Find the request being updated
      const request = requests.find((req) => req._id === id);
      if (!request) throw new Error("Request not found");

      if (status === "Approved") {
        console.log("Approving request:", request);

        // Fetch current stock for the product
        const stockResponse = await axios.get(
          `http://localhost:5000/api/stocks?name=${request.product_name}`
        );
        console.log("Stock API Response:", stockResponse.data);

        if (!stockResponse.data.success || !stockResponse.data.data.length) {
          alert("Product not found in stock!");
          return;
        }

        const stock = stockResponse.data.data[0]; // Assuming the first match
        const currentQuantity = parseInt(stock.product_quantity, 10);
        const requestedQuantity = parseInt(request.requested_quantity, 10);
        const productPrice = stock.product_price; // Get price from stock

        console.log("Current stock quantity:", currentQuantity);
        console.log("Requested quantity:", requestedQuantity);

        if (isNaN(currentQuantity) || isNaN(requestedQuantity)) {
          alert("Invalid stock or request quantity!");
          return;
        }

        if (currentQuantity < requestedQuantity) {
          alert("Insufficient stock to approve this request!");
          return;
        }

        // Update stock quantity
        const newQuantity = currentQuantity - requestedQuantity;
        console.log("New stock quantity to set:", newQuantity);

        const updateStockResponse = await axios.put(
          `http://localhost:5000/api/stocks/${stock._id}`,
          { product_quantity: newQuantity }
        );
        console.log("Stock Update Response:", updateStockResponse.data);

        if (!updateStockResponse.data.success) {
          alert("Failed to update stock quantity!");
          return;
        }

        // Add to SalesStock collection
        const salesStockData = {
          sp_name: request.product_name,
          sp_quantity: requestedQuantity,
          sp_price: productPrice || 0, // Use price from stock, default to 0 if not available
        };

        const salesStockResponse = await axios.post(
          "http://localhost:5000/api/salesstocks",
          salesStockData
        );
        console.log("SalesStock Add Response:", salesStockResponse.data);

        if (!salesStockResponse.data.success) {
          alert("Failed to add item to sales stock!");
          return;
        }
      }

      // Update request status
      const response = await axios.put(
        `http://localhost:5000/api/sales-requests/${id}/status`,
        { status }
      );
      console.log("Status Update Response:", response.data);

      if (response.data.success) {
        setRequests(
          requests.map((req) => (req._id === id ? { ...req, status } : req))
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
      <Nav />
      <h2 className="title-all-requests">All Sales Requests</h2>

      <table className="requests-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Requested Quantity</th>
            <th>Created By</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request._id}</td>
              <td>{request.product_name}</td>
              <td>{request.requested_quantity}</td>
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
    </div>
  );
}

export default AllRequestsApproval;
