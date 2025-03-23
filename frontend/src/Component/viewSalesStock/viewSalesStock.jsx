import React, { useState, useEffect } from "react";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./ViewSalesStock.css";
import axios from "axios";

function ViewSalesStock() {
  const [stockItems, setStockItems] = useState([]); // Ensure initial state is an array
  const [loading, setLoading] = useState(true); // Use loading state
  const [error, setError] = useState(null); // Use error state
  // Removed unused 'data' state

  // Fetch stock data from the salesstock collection
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        setError(null); // Reset error state
        const response = await axios.get("http://localhost:5000/api/salesstocks"); // Adjust endpoint as needed
        if (response.data.success) {
          setStockItems(response.data.salesstock || []); // Fallback to empty array if salesstock is undefined
        } else {
          setError("Failed to fetch stock data: " + response.data.message);
        }
      } catch (error) {
        setError("Error fetching stock data: " + error.message);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchStockData();
  }, []);

  return (
    <div>
      <SalesNav />
      <HeadBar />
      <div className="view-stock-container">
        <div className="header">
          <h2 className="view-stock-title">View Stock</h2>
        </div>
        <div className="table-container">
          {loading ? (
            <p>Loading stock data...</p> // Show loading message
          ) : error ? (
            <p className="error-message">{error}</p> // Show error message
          ) : stockItems.length === 0 ? (
            <p>No stock items available.</p> // Handle empty data case
          ) : (
            <table className="view-stock-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.map((item) => (
                  <tr key={item._id || item.sp_name}> {/* Use _id if available, fallback to sp_name */}
                    <td>{item.sp_name}</td>
                    <td>{item.sp_quantity}</td>
                    <td>${item.sp_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewSalesStock;