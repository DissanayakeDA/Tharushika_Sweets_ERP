import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./SalesRequest.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeadBar from "../HeadBar/HeadBar";

function SalesRequest() {
  const [rows, setRows] = useState([
    { selectedItem: "", currentStock: 0, quantity: 1, price: 0, total: 0 },
  ]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/stocks");
      if (response.data.success) {
        setStocks(response.data.data);
      } else {
        setError("Failed to fetch stock data.");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Error fetching stock data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleItemChange = (index, value) => {
    const stock = stocks.find((item) => item.product_name === value);
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      selectedItem: value,
      currentStock: stock ? stock.product_quantity : 0,
      price: stock ? stock.product_price : 0,
      quantity: 1,
      total: stock ? stock.product_price * 1 : 0,
    };
    setRows(updatedRows);
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    const newQuantity = parseInt(value, 10) || 1;
    if (newQuantity >= 1 && newQuantity <= updatedRows[index].currentStock) {
      updatedRows[index].quantity = newQuantity;
      updatedRows[index].total = newQuantity * updatedRows[index].price;
    }
    setRows(updatedRows);
  };

  const addNewRow = () => {
    setRows([
      ...rows,
      { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    }
  };

  const submitSalesRequest = async () => {
    const filteredRows = rows.filter((row) => row.selectedItem);
    if (filteredRows.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    const salesData = {
      items: filteredRows.map((row) => ({
        product_name: row.selectedItem,
        quantity: row.quantity,
        price: row.price,
      })),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/sales-requests", salesData);
      if (response.data.success) {
        alert("Sales request submitted successfully!");
        navigate("/my-sales-requests");
      } else {
        alert("Failed to submit sales request: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting sales request:", error.response?.data?.message || error.message);
      alert(`Failed to submit sales request: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="sales-request-container">
      <HeadBar />
      <Nav />
      <h2 className="title-sales">Sales Request</h2>

      {loading && <p>Loading stock data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="sales-items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Current Stock</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <select
                  className="select-item"
                  value={row.selectedItem}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                >
                  <option value="">Select Item</option>
                  {stocks.map((item, i) => (
                    <option key={i} value={item.product_name}>
                      {item.product_name}
                    </option>
                  ))}
                </select>
              </td>
              <td>{row.currentStock}</td>
              <td>{row.price}</td>
              <td>
                <input
                  className="quantity-input"
                  type="number"
                  value={row.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  min="1"
                  max={row.currentStock}
                />
              </td>
              <td>{row.total}</td>
              <td>
                <button className="remove-row-btn" onClick={() => removeRow(index)}>
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
        <button className="submit-sales-btn" onClick={submitSalesRequest}>
          Submit Sales Request
        </button>
      </div>
    </div>
  );
}

export default SalesRequest;