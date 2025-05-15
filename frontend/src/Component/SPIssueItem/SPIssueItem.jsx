import React, { useState, useEffect } from "react";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./SPissueitem.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBox,
  FaSearch,
  FaTimes,
  FaShoppingCart,
  FaMinus,
  FaPlus,
} from "react-icons/fa";

function IndirectBuyerIssueItem() {
  const [buyerId, setBuyerId] = useState(
    localStorage.getItem("SPissuebuyerId") || ""
  );
  const [rows, setRows] = useState(
    JSON.parse(localStorage.getItem("SPissueinvoiceData")) || [
      { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
    ]
  );
  const [stockItems, setStockItems] = useState([]);
  const [indirectBuyers, setIndirectBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalBill, setTotalBill] = useState(0);
  const navigate = useNavigate();

  // Calculate total bill whenever rows change
  useEffect(() => {
    const total = rows.reduce((sum, row) => sum + row.total, 0);
    setTotalBill(total);
  }, [rows]);

  // Fetch stock data from the backend
  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/salesstocks");
      if (response.data.success) {
        setStockItems(response.data.data);
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

  // Fetch indirect buyers from the backend
  const fetchIndirectBuyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/indirectbuyers"
      );
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
    fetchStockData();
    fetchIndirectBuyers();
  }, []);

  useEffect(() => {
    // Reset the state
    if (localStorage.getItem("clearDataFlag") === "true") {
      localStorage.removeItem("SPissuebuyerId");
      localStorage.removeItem("SPissueinvoiceData");
      localStorage.removeItem("SPissuetotalBill");
      localStorage.removeItem("SPclearDataFlag");
      setBuyerId("");
      setRows([
        { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
      ]);
    }
  }, []);

  const handleBuyerIdChange = (e) => {
    setBuyerId(e.target.value);
  };

  const handleItemChange = (index, value) => {
    const item = stockItems.find((item) => item.sp_name === value);
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      selectedItem: value,
      currentStock: item ? item.sp_quantity : 0,
      price: item ? item.sp_price : 0,
      quantity: 1,
      total: item ? item.sp_price * 1 : 0,
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

  const decreaseQuantity = (index) => {
    const updatedRows = [...rows];
    if (updatedRows[index].quantity > 1) {
      updatedRows[index].quantity -= 1;
      updatedRows[index].total =
        updatedRows[index].quantity * updatedRows[index].price;
      setRows(updatedRows);
    }
  };

  const increaseQuantity = (index) => {
    const updatedRows = [...rows];
    if (updatedRows[index].quantity < updatedRows[index].currentStock) {
      updatedRows[index].quantity += 1;
      updatedRows[index].total =
        updatedRows[index].quantity * updatedRows[index].price;
      setRows(updatedRows);
    }
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
    const filteredRows = rows.filter((row) => row.selectedItem);
    const totalBill = filteredRows.reduce((sum, row) => sum + row.total, 0);

    localStorage.setItem("SPissuebuyerId", buyerId);
    localStorage.setItem("SPissueinvoiceData", JSON.stringify(filteredRows));
    localStorage.setItem("SPissuetotalBill", totalBill);

    navigate("/spInvoice");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Filter stock items based on search term
  const filteredStockItems = searchTerm
    ? stockItems.filter((item) =>
        item.sp_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stockItems;

  return (
    <div className="indirectissue-items-container">
      <HeadBar />
      <SalesNav />

      <div className="indirectissue-items-content">
        <div className="indirectissue-items-header">
          <h2 className="indirectissue-title">
            <FaBox className="indirectissue-header-icon" />
            Issue Items
          </h2>

          <div className="indirectissue-buyer-container">
            <label htmlFor="indirect-buyer-select">Indirect Buyer:</label>
            <select
              id="indirect-buyer-select"
              className="indirectissue-select-buyer"
              value={buyerId}
              onChange={handleBuyerIdChange}
              required
            >
              <option value="">Select Indirect Buyer</option>
              {indirectBuyers.map((buyer) => (
                <option key={buyer._id} value={buyer._id}>
                  {buyer.buyername} ({buyer._id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="indirectissue-search-container">
          <div className="indirectissue-search-input-wrapper">
            <FaSearch className="indirectissue-search-icon" />
            <input
              type="text"
              className="indirectissue-search-input"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="indirectissue-clear-search"
                onClick={clearSearch}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <span className="indirectissue-items-count">
            {filteredStockItems.length} items available
          </span>
        </div>

        {loading && (
          <div className="indirectissue-loading-spinner">
            <span className="indirectissue-spin-icon">⟳</span>
            Loading data...
          </div>
        )}

        {error && <div className="indirectissue-error-message">{error}</div>}

        {!loading && !error && (
          <div className="indirectissue-table-container">
            <table className="indirectissue-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Current Stock</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="indirectissue-data-row">
                    <td>
                      <select
                        className="indirectissue-select-item"
                        value={row.selectedItem}
                        onChange={(e) =>
                          handleItemChange(index, e.target.value)
                        }
                        disabled={loading}
                      >
                        <option value="">Select Item</option>
                        {filteredStockItems.map((item, i) => (
                          <option key={i} value={item.sp_name}>
                            {item.sp_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      className={
                        row.currentStock <= 5
                          ? "indirectissue-stock-warning"
                          : "indirectissue-stock-value"
                      }
                    >
                      {row.currentStock}
                    </td>
                    <td className="indirectissue-price-value">{row.price}</td>
                    <td>
                      <div className="indirectissue-quantity-control">
                        <button
                          className="indirectissue-quantity-btn indirectissue-decrease"
                          onClick={() => decreaseQuantity(index)}
                          disabled={!row.selectedItem || row.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <input
                          className="indirectissue-quantity-input"
                          type="number"
                          value={row.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          min="1"
                          max={row.currentStock}
                          disabled={loading || !row.selectedItem}
                        />
                        <button
                          className="indirectissue-quantity-btn indirectissue-increase"
                          onClick={() => increaseQuantity(index)}
                          disabled={
                            !row.selectedItem ||
                            row.quantity >= row.currentStock
                          }
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="indirectissue-total-value">{row.total}</td>
                    <td>
                      <button
                        onClick={() => removeRow(index)}
                        className="indirectissue-remove-row-btn"
                        disabled={rows.length === 1 || loading}
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="indirectissue-total-label">
                    Grand Total:
                  </td>
                  <td className="indirectissue-grand-total">{totalBill}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="indirectissue-button-container">
          <button
            className="indirectissue-add-row-btn"
            onClick={addNewRow}
            disabled={loading}
          >
            <FaPlus />
          </button>
          <button
            className={`indirectissue-checkout-btn ${
              !buyerId ? "indirectissue-disabled" : "indirectissue-active"
            }`}
            onClick={goToCheckout}
            disabled={loading || !buyerId}
          >
            <FaShoppingCart /> Go To Checkout
          </button>
        </div>

        {buyerId && rows.some((row) => row.selectedItem) && (
          <div className="indirectissue-summary-panel">
            <h3>Order Summary</h3>
            <div className="indirectissue-summary-content">
              <p>
                <strong>Buyer:</strong>{" "}
                {indirectBuyers.find((b) => b._id === buyerId)?.buyername || ""}
              </p>
              <p>
                <strong>Items Selected:</strong>{" "}
                {rows.filter((r) => r.selectedItem).length}
              </p>
              <p>
                <strong>Total Amount:</strong> {totalBill}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IndirectBuyerIssueItem;
