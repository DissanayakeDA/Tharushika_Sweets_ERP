import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaSearch,
  FaTimes,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";
import HeadBar from "../HeadBar/HeadBar";
import SalesNav from "../SalesNav/SalesNav";
import "./SPReturns.css";

function SPReturns() {
  const navigate = useNavigate();
  const [stockItems, setStockItems] = useState([]);
  const [indirectBuyers, setIndirectBuyers] = useState([]);
  const [rows, setRows] = useState([
    { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
  ]);
  const [buyerId, setBuyerId] = useState("");
  const [selection, setSelection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stockResponse, buyersResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/salesstocks"),
          axios.get("http://localhost:5000/api/indirectbuyers"),
        ]);

        console.log("Stock Response:", stockResponse.data);
        console.log("Buyers Response:", buyersResponse.data);

        // Handle stock items
        if (stockResponse.data.success) {
          const stocks =
            stockResponse.data.stocks || stockResponse.data.data || [];
          console.log("Setting stock items:", stocks);
          setStockItems(stocks);
        } else {
          setStockItems([]);
        }

        // Handle indirect buyers
        if (buyersResponse.data.success) {
          const buyers =
            buyersResponse.data.buyers || buyersResponse.data.data || [];
          console.log("Setting indirect buyers:", buyers);
          setIndirectBuyers(buyers);
        } else {
          setIndirectBuyers([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setStockItems([]);
        setIndirectBuyers([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBuyerIdChange = (e) => {
    const selectedId = e.target.value;
    console.log("Selected Buyer ID:", selectedId);
    setBuyerId(selectedId);
  };

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  const handleItemChange = (index, value) => {
    console.log("Selected Item:", value);
    console.log("Available Stock Items:", stockItems);

    const updatedRows = [...rows];
    const selectedItem = stockItems.find((item) => item.sp_name === value);

    console.log("Found Item:", selectedItem);

    if (selectedItem) {
      updatedRows[index] = {
        ...updatedRows[index],
        selectedItem: value,
        currentStock: selectedItem.sp_quantity || 0,
        price: selectedItem.sp_price || 0,
        total: (selectedItem.sp_price || 0) * updatedRows[index].quantity,
      };
    } else {
      updatedRows[index] = {
        ...updatedRows[index],
        selectedItem: value,
        currentStock: 0,
        price: 0,
        total: 0,
      };
    }

    console.log("Updated Row:", updatedRows[index]);
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

    localStorage.setItem("SPreturnbuyerId", buyerId);
    localStorage.setItem("SPreturninvoiceData", JSON.stringify(filteredRows));
    localStorage.setItem("SPreturntotalBill", totalBill);
    localStorage.setItem("SPreturnMethod", selection);

    navigate("/spreturnInvoice");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredStockItems =
    stockItems?.filter((item) =>
      item?.sp_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="spreturns-items-container">
      <HeadBar />
      <SalesNav />

      <div className="spreturns-items-content">
        <div className="spreturns-items-header">
          <h2 className="spreturns-title">
            <FaBox className="spreturns-header-icon" />
            Return Items
          </h2>

          <div className="spreturns-buyer-container">
            <label htmlFor="indirect-buyer-select">Indirect Buyer:</label>
            <select
              id="indirect-buyer-select"
              className="spreturns-select-buyer"
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

          <div className="spreturns-buyer-container">
            <label htmlFor="return-type-select">Return Type:</label>
            <select
              id="return-type-select"
              className="spreturns-select-buyer"
              value={selection}
              onChange={handleSelectionChange}
            >
              <option value="">Select Return Type</option>
              <option value="issueProduct">Issue Product</option>
              <option value="issueMoney">Issue Money</option>
            </select>
          </div>
        </div>

        <div className="spreturns-search-container">
          <FaSearch className="spreturns-search-icon" />
          <input
            type="text"
            placeholder="Search items..."
            className="spreturns-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className="spreturns-clear-search" onClick={clearSearch}>
              <FaTimes />
            </button>
          )}
        </div>

        {loading && (
          <div className="spreturns-loading-spinner">
            <div className="spreturns-spin-icon">⏳</div>
            Loading...
          </div>
        )}

        {error && (
          <div className="spreturns-error-message">
            <FaTimes />
            {error}
          </div>
        )}

        <div className="spreturns-table-container">
          <table className="spreturns-items-table">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={row.selectedItem}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      className="spreturns-select-buyer"
                      disabled={loading}
                    >
                      <option value="">Select Item</option>
                      {!loading &&
                        filteredStockItems.map((item) => (
                          <option key={item._id} value={item.sp_name}>
                            {item.sp_name}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={row.currentStock}
                      value={row.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      className="spreturns-select-buyer"
                      disabled={!row.selectedItem || loading}
                    />
                  </td>
                  {selection === "issueMoney" ? (
                    <>
                      <td>${row.price.toFixed(2)}</td>
                      <td>${row.total.toFixed(2)}</td>
                    </>
                  ) : (
                    <td>{row.currentStock}</td>
                  )}
                  <td>
                    <button
                      onClick={() => removeRow(index)}
                      className="spreturns-add-row-btn"
                      disabled={rows.length <= 1 || loading}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="spreturns-actions">
          <button
            className="spreturns-add-row-btn"
            onClick={addNewRow}
            disabled={loading}
          >
            <FaPlus />
            Add Row
          </button>
          <button
            className="spreturns-checkout-btn"
            onClick={goToCheckout}
            disabled={loading}
          >
            <FaShoppingCart />
            Go To Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default SPReturns;
