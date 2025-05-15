import React, { useState, useEffect } from "react";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./ViewSalesStock.css";
import axios from "axios";

function ViewSalesStock() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/salesstocks");
      console.log("API Response:", response.data);
      if (response.data.success) {
        setStockItems(response.data.data || []);
      } else {
        setError("Failed to fetch stock data: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Error fetching stock data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleRefresh = () => {
    fetchStockData();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredItems = stockItems.filter((item) =>
    item.sp_name.toLowerCase().includes(searchQuery)
  );

  return (
    <div>
      <SalesNav />
      <HeadBar />
      <div className="view-stock-container">
        <div className="header">
          <h2 className="view-stock-title">Available Stock</h2>
          <div className="header-controls">
            <div className="search-container">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <button
              onClick={handleRefresh}
              className="refresh-button"
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
          </div>
        </div>
        <div className="table-container">
          {loading ? (
            <div className="loading-message">
              <i className="bi bi-arrow-repeat"></i> Loading stock data...
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="bi bi-exclamation-circle"></i> {error}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-message">
              <i className="bi bi-inbox"></i>{" "}
              {searchQuery
                ? "No matching products found"
                : "No stock items available."}
            </div>
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
                {filteredItems.map((item) => (
                  <tr key={item._id || item.sp_name}>
                    <td>{item.sp_name}</td>
                    <td>{item.sp_quantity}</td>
                    <td className="price-cell">
                      ${item.sp_price ? item.sp_price.toFixed(2) : "0.00"}
                    </td>
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
