import React, { useState, useEffect } from "react";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./SPReturns.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function IndirectDirectBuyerReturns() {
  const [buyerId, setBuyerId] = useState(
    localStorage.getItem("returnbuyerId") || ""
  );
  const [rows, setRows] = useState(
    JSON.parse(localStorage.getItem("returninvoiceData")) || [
      { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
    ]
  );
  const [selection, setSelection] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [indirectBuyers, setIndirectBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch stock data from the backend
  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/stocks");
      console.log("API Response:", response.data);
      if (response.data.success) {
        setStockItems(response.data.data);
      } else {
        setError("Failed to fetch stock data.");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Error fetching stock data. Check the console for details.");
    }
  };

  // Fetch indirect buyers from the backend
  const fetchIndirectBuyers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/indirectbuyers");
      console.log("Indirect Buyers Response:", response.data);
      if (response.data.success) {
        setIndirectBuyers(response.data.data);
      } else {
        setError("Failed to fetch indirect buyers data.");
      }
    } catch (error) {
      console.error("Error fetching indirect buyers:", error);
      setError("Error fetching indirect buyers data.");
    }
  };

  useEffect(() => {
    // Reset state
    if (localStorage.getItem("clearDataFlag") === "true") {
      localStorage.removeItem("returnbuyerId");
      localStorage.removeItem("returninvoiceData");
      localStorage.removeItem("returntotalBill");
      localStorage.removeItem("returnMethod");
      localStorage.removeItem("clearDataFlag");
      setBuyerId("");
      setRows([
        { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
      ]);
      setSelection("");
    }
  }, []);

  // Fetch both stock and indirect buyers data
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchStockData(), fetchIndirectBuyers()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleBuyerIdChange = (e) => {
    setBuyerId(e.target.value);
  };

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
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
      alert("Indirect Buyer ID is required before proceeding to checkout.");
      return;
    }
    if (!selection) {
      alert("Please select a return method before checkout.");
      return;
    }

    const filteredRows = rows.filter((row) => row.selectedItem);
    const totalBill = filteredRows.reduce((sum, row) => sum + row.total, 0);

    localStorage.setItem("returnbuyerId", buyerId);
    localStorage.setItem("returninvoiceData", JSON.stringify(filteredRows));
    localStorage.setItem("returntotalBill", totalBill);
    localStorage.setItem("returnMethod", selection);

    navigate("/returnInvoice");
  };

  return (
    <div className="return-items-container">
      <HeadBar />
      <SalesNav />
      <h2 className="title-return">Return Items</h2>
      <hr className="hr-issue" />
      <div className="selection-container">
        <label>Select Return Type: </label>
        <select
          className="select-type-return"
          value={selection}
          onChange={handleSelectionChange}
        >
          <option value="">Select an option</option>
          <option value="issueProduct">Issue Product</option>
          <option value="issueMoney">Issue Money</option>
        </select>
      </div>

      <select
        name="indirect_buyer_id"
        value={buyerId}
        onChange={handleBuyerIdChange}
        className="id-input-issue"
        required
      >
        <option value="">Select Indirect Buyer ID</option>
        {indirectBuyers.map((buyer) => (
          <option key={buyer._id} value={buyer._id}>
            {buyer.buyername} ({buyer._id})
          </option>
        ))}
      </select>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="issue-items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Return Quantity</th>
            {selection === "issueMoney" ? (
              <>
                <th>Product Price</th>
                <th>Total Price</th>
              </>
            ) : (
              <th>Current Stock</th>
            )}
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
                  disabled={loading}
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

              <td>
                <input
                  className="qty-input"
                  type="number"
                  value={row.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  min="1"
                  disabled={loading || !row.selectedItem}
                />
              </td>

              {selection === "issueMoney" ? (
                <>
                  <td>{row.price}</td>
                  <td>{row.total}</td>
                </>
              ) : (
                <td>{row.currentStock}</td>
              )}

              <td>
                <button
                  onClick={() => removeRow(index)}
                  className="remove-row-btn"
                  disabled={rows.length === 1 || loading}
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
        <button
          className="checkout-btn"
          onClick={goToCheckout}
          disabled={loading}
        >
          Go To Checkout
        </button>
      </div>
    </div>
  );
}

export default IndirectDirectBuyerReturns;