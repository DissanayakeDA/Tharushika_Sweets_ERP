import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./MySalesRequests.css";
import axios from "axios";
import HeadBar from "../HeadBar/HeadBar";

function MySalesRequests() {
  const [salesRequests, setSalesRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMySalesRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/sales-requests");
      if (response.data.success) {
        setSalesRequests(response.data.data);
      } else {
        setError("Failed to fetch your sales requests.");
      }
    } catch (error) {
      console.error("Error fetching sales requests:", error);
      setError("Error fetching your sales requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySalesRequests();
  }, []);

  return (
    <div className="my-sales-requests-container">
      <HeadBar />
      <Nav />
      <h2 className="title-my-sales">My Sales Requests</h2>

      {loading && <p>Loading your sales requests...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="my-sales-requests-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Requested At</th>
            <th>Items</th>
            <th>Status</th>
            <th>Processed At</th>
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
              <td>{request.processedAt ? new Date(request.processedAt).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MySalesRequests;