import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeadBar from "../HeadBar/HeadBar";
import "./IssueItems.css";
import {
  FaPlus,
  FaMinus,
  FaBoxOpen,
  FaShoppingCart,
  FaSpinner,
  FaSearch,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function IssueItems() {
  const [buyerId, setBuyerId] = useState(
    localStorage.getItem("issuebuyerId") || ""
  );
  const [rows, setRows] = useState(
    JSON.parse(localStorage.getItem("issueinvoiceData")) || [
      { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
    ]
  );
  const [stockItems, setStockItems] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/stocks");
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

  const fetchBuyers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/buyers");
      if (response.data.buyers) {
        setBuyers(response.data.buyers);
      } else {
        setError("Failed to fetch buyer data.");
      }
    } catch (error) {
      console.error("Error fetching buyer data:", error);
      setError("Error fetching buyer data.");
    }
  };

  useEffect(() => {
    fetchStockData();
    fetchBuyers();
  }, []);

  // Reset state if clearDataFlag is set
  useEffect(() => {
    if (localStorage.getItem("clearDataFlag") === "true") {
      localStorage.removeItem("issuebuyerId");
      localStorage.removeItem("issueinvoiceData");
      localStorage.removeItem("issuetotalBill");
      localStorage.removeItem("clearDataFlag");
      setBuyerId("");
      setRows([
        { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
      ]);
    }
  }, []);

  const handleBuyerIdChange = (e) => {
    const selectedBuyerId = e.target.value;
    setBuyerId(selectedBuyerId);
    if (selectedBuyerId) {
      const selectedBuyer = buyers.find(
        (buyer) => buyer._id === selectedBuyerId
      );
      toast.info(
        `Selected buyer: ${
          selectedBuyer?.name || "Unknown"
        } (${selectedBuyerId})`,
        {
          autoClose: 1500,
        }
      );
    }
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

    // Provide feedback
    if (value) {
      toast.info(`Selected ${value}`, { autoClose: 1500 });
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    const newQuantity = parseInt(value, 10) || 1; // Default to 1 if invalid
    const maxStock = updatedRows[index].currentStock;

    if (newQuantity >= 1 && newQuantity <= maxStock) {
      updatedRows[index].quantity = newQuantity;
      updatedRows[index].total = newQuantity * updatedRows[index].price;
    } else if (newQuantity > maxStock) {
      updatedRows[index].quantity = maxStock;
      updatedRows[index].total = maxStock * updatedRows[index].price;
      toast.warning(`Maximum available stock is ${maxStock}`, {
        autoClose: 2000,
      });
    }

    setRows(updatedRows);
  };

  const addNewRow = () => {
    setRows([
      ...rows,
      { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
    ]);
    toast.success("New row added!", { autoClose: 1500 });
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const rowToRemove = rows[index];
      const confirmMessage = `Remove ${
        rowToRemove.selectedItem || "this item"
      }?`;

      if (window.confirm(confirmMessage)) {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
        toast.info("Row removed", { autoClose: 1500 });
      }
    } else {
      toast.warning("Cannot remove the last row", { autoClose: 2000 });
    }
  };

  const calculateTotalBill = () => {
    return rows.reduce((sum, row) => sum + row.total, 0);
  };

  const validateForm = () => {
    return buyerId && rows.some((row) => row.selectedItem && row.quantity > 0);
  };

  const handleSubmit = () => {
    if (!buyerId.trim()) {
      toast.error("Please select a Buyer ID");
      return;
    }

    if (!validateForm()) {
      toast.error("Please select at least one product with a valid quantity.");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    setSubmitting(true);

    // Filter rows to only include those with a selected item
    const filteredRows = rows.filter((row) => row.selectedItem);
    const totalBill = filteredRows.reduce((sum, row) => sum + row.total, 0);

    localStorage.setItem("issuebuyerId", buyerId);
    localStorage.setItem("issueinvoiceData", JSON.stringify(filteredRows));
    localStorage.setItem("issuetotalBill", totalBill);

    toast.success("Proceeding to checkout!");

    // Simulate network delay for visual feedback
    setTimeout(() => {
      setSubmitting(false);
      setShowConfirmation(false);
      navigate("/invoice");
    }, 800);
  };

  const cancelSubmit = () => {
    setShowConfirmation(false);
  };

  // Filter products based on search term
  const filteredStockItems = searchTerm
    ? stockItems.filter((item) =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stockItems;

  return (
    <div className="dbissue-items-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <HeadBar />
      <Nav />

      <div className="dbissue-items-content">
        <div className="dbissue-items-header">
          <h2 className="dbissue-title">
            <FaShoppingCart className="dbissue-header-icon" /> Issue Items
          </h2>

          <div className="dbissue-buyer-container">
            <label htmlFor="buyerId">Select Buyer: </label>
            <select
              id="buyerId"
              className="dbissue-select-buyer"
              value={buyerId}
              onChange={handleBuyerIdChange}
              required
            >
              <option value="">Select Buyer</option>
              {buyers.map((buyer) => (
                <option key={buyer._id} value={buyer._id}>
                  {buyer.name} ({buyer._id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="dbissue-loading-spinner">
            <FaSpinner className="dbissue-spin-icon" /> Loading stock data...
          </div>
        ) : error ? (
          <div className="dbissue-error-message">{error}</div>
        ) : (
          <>
            <div className="dbissue-search-container">
              <div className="dbissue-search-input-wrapper">
                <FaSearch className="dbissue-search-icon" />
                <input
                  type="text"
                  className="dbissue-search-input"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="dbissue-clear-search"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="dbissue-items-count">
                {filteredStockItems.length} products available
              </div>
            </div>

            <div className="dbissue-table-container">
              <table className="dbissue-items-table">
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
                    <tr
                      key={index}
                      className={`dbissue-data-row ${
                        row.selectedItem ? "dbissue-selected-row" : ""
                      }`}
                    >
                      <td>
                        <select
                          className="dbissue-select-item"
                          value={row.selectedItem}
                          onChange={(e) =>
                            handleItemChange(index, e.target.value)
                          }
                        >
                          <option value="">Select Item</option>
                          {filteredStockItems.map((item, i) => (
                            <option
                              key={i}
                              value={item.product_name}
                              disabled={item.product_quantity === 0}
                            >
                              {item.product_name}{" "}
                              {item.product_quantity === 0
                                ? "(Out of stock)"
                                : ""}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td
                        className={`dbissue-stock-value ${
                          row.currentStock === 0 ? "dbissue-stock-warning" : ""
                        }`}
                      >
                        {row.currentStock > 0 ? row.currentStock : "-"}
                      </td>
                      <td className="dbissue-price-value">
                        LKR {row.price > 0 ? row.price.toFixed(2) : "0.00"}
                      </td>
                      <td>
                        <div className="dbissue-quantity-control">
                          <button
                            className="dbissue-quantity-btn dbissue-decrease"
                            onClick={() =>
                              handleQuantityChange(
                                index,
                                Math.max(1, row.quantity - 1)
                              )
                            }
                            disabled={row.quantity <= 1 || !row.selectedItem}
                          >
                            -
                          </button>
                          <input
                            className="dbissue-quantity-input"
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                            min="1"
                            max={row.currentStock}
                            disabled={!row.selectedItem}
                          />
                          <button
                            className="dbissue-quantity-btn dbissue-increase"
                            onClick={() =>
                              handleQuantityChange(index, row.quantity + 1)
                            }
                            disabled={
                              row.quantity >= row.currentStock ||
                              !row.selectedItem
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="dbissue-total-value">
                        LKR {row.total > 0 ? row.total.toFixed(2) : "0.00"}
                      </td>
                      <td>
                        <button
                          className="dbissue-remove-row-btn"
                          onClick={() => removeRow(index)}
                          title="Remove row"
                        >
                          -
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="dbissue-total-label">
                      Grand Total:
                    </td>
                    <td className="dbissue-grand-total">
                      LKR {calculateTotalBill().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="dbissue-button-container">
              <button
                className="dbissue-add-row-btn"
                onClick={addNewRow}
                title="Add new row"
              >
                +
              </button>
              <button
                className={`dbissue-checkout-btn ${
                  validateForm() ? "dbissue-active" : "dbissue-disabled"
                }`}
                onClick={handleSubmit}
                disabled={!validateForm() || submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="dbissue-spin-icon" /> Processing...
                  </>
                ) : (
                  "Go To Checkout"
                )}
              </button>
            </div>

            {/* Summary section */}
            {rows.some((row) => row.selectedItem) && (
              <div className="dbissue-summary-panel">
                <h3>Summary</h3>
                <div className="dbissue-summary-content">
                  <p>
                    <strong>Items selected:</strong>{" "}
                    {rows.filter((r) => r.selectedItem).length}
                  </p>
                  <p>
                    <strong>Total quantity:</strong>{" "}
                    {rows.reduce(
                      (sum, row) => sum + (row.selectedItem ? row.quantity : 0),
                      0
                    )}
                  </p>
                  <p>
                    <strong>Total value:</strong> LKR{" "}
                    {calculateTotalBill().toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="dbissue-confirmation-overlay">
            <div className="dbissue-confirmation-dialog">
              <h3>Confirm Checkout</h3>
              <p>Are you sure you want to proceed with this transaction?</p>

              <div className="dbissue-confirmation-summary">
                <p>
                  Issuing {rows.filter((r) => r.selectedItem).length} products
                </p>
                <p>
                  Total items:{" "}
                  {rows.reduce(
                    (sum, row) => sum + (row.selectedItem ? row.quantity : 0),
                    0
                  )}
                </p>
                <p>Total value: LKR {calculateTotalBill().toFixed(2)}</p>
                <p>
                  Buyer:{" "}
                  {buyers.find((buyer) => buyer._id === buyerId)?.name ||
                    "Unknown"}{" "}
                  ({buyerId})
                </p>
              </div>

              <div className="dbissue-confirmation-actions">
                <button
                  className="dbissue-confirm-btn"
                  onClick={confirmSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="dbissue-spin-icon" /> Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck /> Confirm
                    </>
                  )}
                </button>
                <button
                  className="dbissue-cancel-btn"
                  onClick={cancelSubmit}
                  disabled={submitting}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueItems;
