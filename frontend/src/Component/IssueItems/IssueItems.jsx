// issueitems.jsx
import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./IssueItems.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed

function IssueItems() {
  const [buyerId, setBuyerId] = useState(localStorage.getItem("buyerId") || "");
  const [rows, setRows] = useState(
    JSON.parse(localStorage.getItem("invoiceData")) || [
      { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
    ]
  );
  const [stockItems, setStockItems] = useState([]); // State to hold fetched stock data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch stock data from the backend
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get("http://localhost:5000/api/stocks"); // Adjust URL if needed
        console.log("API Response:", response.data); // Log the response to debug
        if (response.data.success) {
          setStockItems(response.data.data); // Update state with the stock data array
        } else {
          setError("Failed to fetch stock data.");
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Error fetching stock data. Check the console for details.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    
    fetchStockData();
  }, []);

  

  const handleBuyerIdChange = (e) => {
    setBuyerId(e.target.value);
  };

  const handleItemChange = (index, value) => {
    const item = stockItems.find((item) => item.product_name === value);
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      selectedItem: value,
      currentStock: item ? item.product_quantity : 0,
      price: item ? item.product_price : 0,
      quantity: 1,
      total: item ? item.product_price * 1 : 0,
    };
    setRows(updatedRows);
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    const newQuantity = parseInt(value, 10);

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
      const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
      setRows(updatedRows);
    }
  };

  const goToCheckout = () => {
    if (!buyerId.trim()) {
      alert("Buyer ID is required before proceeding to checkout.");
      return;
    }
    const filteredRows = rows.filter((row) => row.selectedItem);
    const totalBill = filteredRows.reduce((sum, row) => sum + row.total, 0);

    localStorage.setItem("buyerId", buyerId);
    localStorage.setItem("invoiceData", JSON.stringify(filteredRows));
    localStorage.setItem("totalBill", totalBill);

    navigate("/invoice");
  };

  useEffect(() => {
    if (localStorage.getItem("clearDataFlag") === "true") {
      localStorage.removeItem("buyerId");
      localStorage.removeItem("invoiceData");
      localStorage.removeItem("totalBill");
      localStorage.removeItem("clearDataFlag");
      setBuyerId("");
      setRows([{ selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 }]);
    }
  }, []);

  return (
    <div className="issue-items-container">
      <Nav />
      <h2 className="title">Issue Items</h2>
      <hr className="hr-issue" />

      <div className="buyer-id-section">
        <input
          type="text"
          name="buyer_id"
          placeholder="Enter Buyer ID"
          className="id-input"
          value={buyerId}
          onChange={handleBuyerIdChange}
          required
        />
      </div>

      {loading && <p>Loading stock data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="issue-items-table">
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
                  value={row.selectedItem}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  disabled={loading} // Disable select while loading
                >
                  <option value="">Select Item</option>
                  {!loading &&
                    stockItems.map((item, i) => (
                      <option key={i} value={item.product_name}>
                        {item.product_name}
                      </option>
                    ))}
                </select>
              </td>

              <td>{row.currentStock}</td>

              <td>{row.price}</td>

              <td className="qty-input">
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  min="1"
                  max={row.currentStock}
                  disabled={loading || !row.selectedItem} // Disable if loading or no item selected
                />
              </td>

              <td>{row.total}</td>

              <td>
                <button
                  onClick={() => removeRow(index)}
                  className="remove-row-btn"
                  disabled={rows.length === 1 || loading} // Disable if loading
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="issue-btn-container">
        <button className="add-row-btn" onClick={addNewRow} disabled={loading}>
          +
        </button>
        <button className="checkout-btn" onClick={goToCheckout} disabled={loading}>
          Go To Checkout
        </button>
      </div>
    </div>
  );
}

export default IssueItems;