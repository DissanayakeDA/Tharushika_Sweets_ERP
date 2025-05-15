import React, { useState, useEffect } from "react";
import "./StockRequestForm.css";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import { useNavigate } from "react-router-dom";

function StockRequestForm() {
  const [formData, setFormData] = useState({
    product_name: "",
    quantity: "",
    note: "",
  });
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch available stocks on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const response = await fetch("http://localhost:5000/api/stocks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`, // Adjust if no token is needed
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setStocks(data.data);
        } else {
          setError(
            "Failed to fetch stocks: " + (data.message || "Unknown error")
          );
        }
      } catch (err) {
        setError("Server error while fetching stocks.");
        console.error("Error fetching stocks:", err);
      }
    };

    fetchStocks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "product_name") {
      const selected = stocks.find((stock) => stock.product_name === value);
      setSelectedStock(selected || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.product_name || !formData.quantity) {
      setError("Product name and quantity are required.");
      return;
    }

    const quantity = Number(formData.quantity);
    if (quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    // Validate quantity against available stock
    if (selectedStock && quantity > selectedStock.product_quantity) {
      setError(
        `Requested quantity exceeds available stock (${selectedStock.product_quantity}).`
      );
      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const response = await fetch("http://localhost:5000/api/stock-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Adjust if no token is needed
        },
        body: JSON.stringify({
          product_name: formData.product_name,
          quantity,
          note: formData.note,
          requested_by: user?.username || "Guest",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(
          `Request submitted successfully! Request ID: ${data.request_id}`
        );
        setFormData({ product_name: "", quantity: "", note: "" });
        setSelectedStock(null);
        setTimeout(() => navigate("/my-requests"), 2000);
      } else {
        setError(data.message || "Failed to submit request.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error("Error submitting request:", err);
    }
  };

  return (
    <div className="stock-request-container">
      <HeadBar />
      <SalesNav />
      <div className="stock-request-main">
        <h2 className="form-title">Stock Request Form</h2>
        <form onSubmit={handleSubmit} className="stock-request-form">
          <div className="form-group">
            <label htmlFor="product_name">Product Name</label>
            <select
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              {stocks.length > 0 ? (
                stocks.map((stock) => (
                  <option key={stock._id} value={stock.product_name}>
                    {stock.product_name} (Qty: {stock.product_quantity})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No stocks available
                </option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="1"
              required
            />
            {selectedStock && (
              <p className="stock-info">
                Available: {selectedStock.product_quantity} units
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="note">Note (Optional)</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add any additional notes"
              rows="4"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default StockRequestForm;
