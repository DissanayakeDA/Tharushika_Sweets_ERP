import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import "./DirectBuyerReturns.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaMinus,
  FaBoxOpen,
  FaSpinner,
  FaSearch,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DirectBuyerReturns() {
  const [buyerId, setBuyerId] = useState(
    localStorage.getItem("returnbuyerId") || ""
  );
  const [rows, setRows] = useState(
    JSON.parse(localStorage.getItem("returninvoiceData")) || [
      { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
    ]
  );
  const [selection, setSelection] = useState(
    localStorage.getItem("returnMethod") || ""
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

  useEffect(() => {
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

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
    if (event.target.value) {
      toast.info(`Selected return type: ${event.target.value}`, {
        autoClose: 1500,
      });
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
    if (value) {
      toast.info(`Selected ${value}`, { autoClose: 1500 });
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    const newQuantity = parseInt(value, 10) || 1;
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
    return (
      buyerId &&
      selection &&
      rows.some((row) => row.selectedItem && row.quantity > 0)
    );
  };

  const handleSubmit = () => {
    if (!buyerId.trim()) {
      toast.error("Please select a Buyer ID");
      return;
    }
    if (!selection) {
      toast.error("Please select a return type");
      return;
    }
    if (!validateForm()) {
      toast.error("Please select at least one product with a valid quantity.");
      return;
    }
    if (selection === "issueProduct") {
      const zeroStockItems = rows
        .filter((row) => row.selectedItem && row.currentStock === 0)
        .map((row) => row.selectedItem);
      if (zeroStockItems.length > 0) {
        toast.error(
          `Cannot proceed with return. The following items have zero stock: ${zeroStockItems.join(
            ", "
          )}`,
          { autoClose: 3000 }
        );
        return;
      }
    }
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    setSubmitting(true);
    const filteredRows = rows.filter((row) => row.selectedItem);
    const totalBill = filteredRows.reduce((sum, row) => sum + row.total, 0);
    localStorage.setItem("returnbuyerId", buyerId);
    localStorage.setItem("returninvoiceData", JSON.stringify(filteredRows));
    localStorage.setItem("returntotalBill", totalBill);
    localStorage.setItem("returnMethod", selection);
    toast.success("Proceeding to checkout!");
    setTimeout(() => {
      setSubmitting(false);
      setShowConfirmation(false);
      navigate("/returnInvoice");
    }, 800);
  };

  const cancelSubmit = () => {
    setShowConfirmation(false);
  };

  const filteredStockItems = searchTerm
    ? stockItems.filter((item) =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stockItems;

  return (
    <div className="dbreturns-items-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <HeadBar />
      <Nav />
      <div className="dbreturns-items-content">
        <div className="dbreturns-items-header">
          <h2 className="dbreturns-title">
            <FaBoxOpen className="dbreturns-header-icon" /> Return Items
          </h2>
          <div className="dbreturns-selection-container">
            <label htmlFor="returnType">Select Return Type: </label>
            <select
              id="returnType"
              className="dbreturns-select-type"
              value={selection}
              onChange={handleSelectionChange}
              required
            >
              <option value="">Select an option</option>
              <option value="issueProduct">Issue Product</option>
              <option value="issueMoney">Issue Money</option>
            </select>
          </div>
        </div>

        <div className="dbreturns-buyer-container">
          <label htmlFor="buyerId">Select Buyer: </label>
          <select
            id="buyerId"
            className="dbreturns-select-buyer"
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

        {loading ? (
          <div className="dbreturns-loading-spinner">
            <FaSpinner className="dbreturns-spin-icon" /> Loading stock data...
          </div>
        ) : error ? (
          <div className="dbreturns-error-message">{error}</div>
        ) : (
          <>
            <div className="dbreturns-search-container">
              <div className="dbreturns-search-input-wrapper">
                <FaSearch className="dbreturns-search-icon" />
                <input
                  type="text"
                  className="dbreturns-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="dbreturns-clear-search"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <div className="dbreturns-items-count">
                {filteredStockItems.length} products available
              </div>
            </div>

            <div className="dbreturns-table-container">
              <table className="dbreturns-items-table">
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
                      className={`dbreturns-data-row ${
                        row.selectedItem ? "dbreturns-selected-row" : ""
                      }`}
                    >
                      <td>
                        <select
                          className="dbreturns-select-item"
                          value={row.selectedItem}
                          onChange={(e) =>
                            handleItemChange(index, e.target.value)
                          }
                        >
                          <option value="">Select Item</option>
                          {filteredStockItems.map((item, i) => (
                            <option key={i} value={item.product_name}>
                              {item.product_name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="dbreturns-stock-value">
                        {row.currentStock > 0 ? row.currentStock : "-"}
                      </td>
                      <td className="dbreturns-price-value">
                        LKR {row.price > 0 ? row.price.toFixed(2) : "0.00"}
                      </td>
                      <td>
                        <div className="dbreturns-quantity-control">
                          <button
                            className="dbreturns-quantity-btn dbreturns-decrease"
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
                            className="dbreturns-quantity-input"
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
                            className="dbreturns-quantity-btn dbreturns-increase"
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
                      <td className="dbreturns-total-value">
                        LKR {row.total > 0 ? row.total.toFixed(2) : "0.00"}
                      </td>
                      <td>
                        <button
                          className="dbreturns-remove-row-btn"
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
                    <td colSpan="4" className="dbreturns-total-label">
                      Grand Total:
                    </td>
                    <td className="dbreturns-grand-total">
                      LKR {calculateTotalBill().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="dbreturns-button-container">
              <button
                className="dbreturns-add-row-btn"
                onClick={addNewRow}
                title="Add new row"
              >
                +
              </button>
              <button
                className={`dbreturns-checkout-btn ${
                  validateForm() ? "dbreturns-active" : "dbreturns-disabled"
                }`}
                onClick={handleSubmit}
                disabled={!validateForm() || submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="dbreturns-spin-icon" /> Processing...
                  </>
                ) : (
                  "Go To Checkout"
                )}
              </button>
            </div>

            {rows.some((row) => row.selectedItem) && (
              <div className="dbreturns-summary-panel">
                <h3>Summary</h3>
                <div className="dbreturns-summary-content">
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
                  <p>
                    <strong>Return Type:</strong> {selection || "Not selected"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {showConfirmation && (
          <div className="dbreturns-confirmation-overlay">
            <div className="dbreturns-confirmation-dialog">
              <h3>Confirm Return</h3>
              <p>Are you sure you want to proceed with this return?</p>
              <div className="dbreturns-confirmation-summary">
                <p>Return Type: {selection}</p>
                <p>
                  Buyer:{" "}
                  {buyers.find((buyer) => buyer._id === buyerId)?.name ||
                    "Unknown"}{" "}
                  ({buyerId})
                </p>
                <p>
                  Returning {rows.filter((r) => r.selectedItem).length} items
                </p>
                <p>
                  Total quantity:{" "}
                  {rows.reduce(
                    (sum, row) => sum + (row.selectedItem ? row.quantity : 0),
                    0
                  )}
                </p>
                <p>Total value: LKR {calculateTotalBill().toFixed(2)}</p>
              </div>
              <div className="dbreturns-confirmation-actions">
                <button
                  className="dbreturns-confirm-btn"
                  onClick={confirmSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="dbreturns-spin-icon" />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck /> Confirm
                    </>
                  )}
                </button>
                <button
                  className="dbreturns-cancel-btn"
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

export default DirectBuyerReturns;
