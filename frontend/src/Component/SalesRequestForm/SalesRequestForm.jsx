import React, { useState, useEffect, useRef } from "react";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./SalesRequestForm.css";
import { useNavigate } from "react-router-dom";

function SalesRequestForm() {
  const [rows, setRows] = useState([
    { product_name: "", requested_quantity: 1 },
  ]);
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();
  const isMounted = useRef(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  // Fetch stock data
  const fetchStockData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stocks");
      console.log("Stock API Response:", response.data);
      if (response.data.success) {
        const stockData = response.data.data || [];
        console.log("Raw stock data:", stockData);
        setStocks(stockData);
        console.log("Stocks set to state:", stockData);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isMounted.current) {
      fetchStockData();
      isMounted.current = true;
    }

    return () => {
      isMounted.current = false;
    };
  }, [navigate, user]);

  const handleProductChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].product_name = value;
    setRows(updatedRows);
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    const newQuantity = parseInt(value, 10) || 1;
    if (newQuantity >= 1) {
      updatedRows[index].requested_quantity = newQuantity;
    }
    setRows(updatedRows);
  };

  const addNewRow = () => {
    setRows([...rows, { product_name: "", requested_quantity: 1 }]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    }
  };

  const submitSalesRequest = async () => {
    const filteredRows = rows.filter((row) => row.product_name);
    if (filteredRows.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    try {
      for (const row of filteredRows) {
        await axios.post(
          "http://localhost:5000/api/sales-requests",
          {
            product_name: row.product_name,
            requested_quantity: row.requested_quantity,
            created_by: user.username,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      alert("Sales request submitted successfully!");
      navigate("/my-requests");
    } catch (error) {
      console.error(
        "Error submitting sales request:",
        error.response ? error.response.data : error.message
      );
      alert(
        `Failed to submit sales request: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <div className="sales-request-container">
      <HeadBar />
      <Nav />
      <h2 className="title-sales-request">Create Sales Request</h2>

      {/* Debug: Show stock data as plain text */}
      {stocks.length > 0 && (
        <div className="debug-section">
          <p>Stocks available (debug):</p>
          <ul>
            {stocks.map((stock, index) => (
              <li key={index}>
                {stock.product_name} (Stock: {stock.product_quantity}, ID:{" "}
                {stock._id})
              </li>
            ))}
          </ul>
        </div>
      )}

      <table className="sales-request-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Requested Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <select
                  className="select-product"
                  value={row.product_name}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                >
                  <option value="">Select Product</option>
                  {stocks.length > 0 ? (
                    stocks.map((stock) => (
                      <option key={stock._id} value={stock.product_name}>
                        {stock.product_name} (Stock: {stock.product_quantity})
                      </option>
                    ))
                  ) : (
                    <option value="">No products available</option>
                  )}
                </select>
              </td>
              <td>
                <input
                  className="quantity-input"
                  type="number"
                  value={row.requested_quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  min="1"
                />
              </td>
              <td>
                <button
                  className="remove-row-btn"
                  onClick={() => removeRow(index)}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className="add-row-btn-sales" onClick={addNewRow}>
          +
        </button>
        <button className="submit-request-btn" onClick={submitSalesRequest}>
          Submit Request
        </button>
      </div>
    </div>
  );
}

export default SalesRequestForm;
