import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./IssueItems.css";
import { useNavigate } from "react-router-dom";

const itemsList = [
  { name: "Item A", stock: 50, price: 10 },
  { name: "Item B", stock: 20, price: 15 },
  { name: "Item C", stock: 30, price: 20 },
  { name: "Item D", stock: 40, price: 25 },
  { name: "Item E", stock: 60, price: 30 },
];

function IssueItems() {
  const [buyerId, setBuyerId] = useState(localStorage.getItem("buyerId") || "");
  const [rows, setRows] = useState(
    JSON.parse(localStorage.getItem("invoiceData")) || [
      { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
    ]
  );

  const navigate = useNavigate();

  const handleBuyerIdChange = (e) => {
    setBuyerId(e.target.value);
  };

  const handleItemChange = (index, value) => {
    const item = itemsList.find((item) => item.name === value);
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      selectedItem: value,
      currentStock: item ? item.stock : 0,
      price: item ? item.price : 0,
      quantity: 1,
      total: item ? item.price * 1 : 0,
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
                >
                  <option value="">Select Item</option>
                  {itemsList.map((item, i) => (
                    <option key={i} value={item.name}>
                      {item.name}
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
                />
              </td>

              <td>{row.total}</td>

              <td>
                <button
                  onClick={() => removeRow(index)}
                  className="remove-row-btn"
                  disabled={rows.length === 1} // Disable remove button for the last row
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="issue-btn-container">
        <button className="add-row-btn" onClick={addNewRow}>
          +
        </button>
        <button className="checkout-btn" onClick={goToCheckout}>
          Go To Checkout
        </button>
      </div>
    </div>
  );
}

export default IssueItems;
