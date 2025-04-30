import React, { useState, useEffect, useRef } from "react";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./StockChangeRequestForm.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function StockChangeRequestForm() {
  const [stock, setStock] = useState(null);
  const location = useLocation();
  const [requestType, setRequestType] = useState(
    location.state?.requestType || "update"
  );
  const [proposedQuantityInput, setProposedQuantityInput] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { stockId } = useParams();
  const isMounted = useRef(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const fetchStockData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/stocks/${stockId}`
      );
      if (response.data.success) {
        const data = response.data.data;
        setStock(data);
        setProposedQuantityInput(data.product_quantity.toString());
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Failed to load stock data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted.current) {
      fetchStockData();
      isMounted.current = true;
    }
    return () => {
      isMounted.current = false;
    };
  }, [stockId]);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setProposedQuantityInput(value);
    }
  };

  const submitStockChangeRequest = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert("Please provide a reason for the request.");
      return;
    }

    const quantity = parseInt(proposedQuantityInput, 10);
    if (
      requestType === "update" &&
      (isNaN(quantity) || proposedQuantityInput === "")
    ) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      const requestData = {
        stock_id: stockId,
        request_type: requestType,
        proposed_changes:
          requestType === "update" ? { product_quantity: quantity } : null,
        reason: reason.trim(),
        created_by: user?.username || "Unknown",
      };

      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/stock-change-requests",
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        alert("Stock change request submitted successfully!");
        navigate("/mystock-change-requests");
      }
    } catch (error) {
      console.error("Error submitting stock change request:", error);
      alert(
        `Failed to submit stock change request: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="SRF-main-container">
      <HeadBar />
      <Nav />
      <div className="SRF-content-wrapper">
        <div className="SRF-page-header">
          <div className="SRF-header-left">
            <h2 className="SRF-title">Create Stock Change Request</h2>
            <p className="SRF-subtitle">
              {requestType === "update"
                ? "Update the quantity of an existing stock item"
                : "Request to remove an item from inventory"}
            </p>
          </div>
          {stock && (
            <div className="SRF-stock-badge">
              <span className="SRF-badge-label">Stock ID:</span>
              <span className="SRF-badge-value">
                {stock._id.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>

        {isLoading && !stock ? (
          <div className="SRF-loading-container">
            <div className="SRF-loading-spinner"></div>
            <p className="SRF-loading-text">Loading stock data...</p>
          </div>
        ) : error ? (
          <div className="SRF-error-container">
            <div className="SRF-error-icon">⚠️</div>
            <p className="SRF-error-message">{error}</p>
            <button
              type="button"
              className="SRF-retry-btn"
              onClick={fetchStockData}
            >
              <span className="SRF-btn-icon">↻</span> Retry
            </button>
          </div>
        ) : stock ? (
          <form
            className="SRF-form-container"
            onSubmit={submitStockChangeRequest}
          >
            <div className="SRF-two-column-layout">
              <div className="SRF-left-column">
                <div className="SRF-stock-info-card">
                  <div className="SRF-card-header">
                    <h3 className="SRF-card-title">Stock Information</h3>
                  </div>
                  <div className="SRF-info-content">
                    <div className="SRF-info-row">
                      <div className="SRF-info-label">Product Name:</div>
                      <div className="SRF-info-value">{stock.product_name}</div>
                    </div>
                    <div className="SRF-info-row">
                      <div className="SRF-info-label">Current Quantity:</div>
                      <div className="SRF-info-value SRF-quantity-highlight">
                        {stock.product_quantity}
                      </div>
                    </div>
                    <div className="SRF-info-row">
                      <div className="SRF-info-label">Stock ID:</div>
                      <div className="SRF-info-value SRF-id-display">
                        {stock._id}
                      </div>
                    </div>
                  </div>
                </div>

                {requestType === "delete" && (
                  <div className="SRF-warning-panel">
                    <div className="SRF-warning-icon">⚠️</div>
                    <div className="SRF-warning-content">
                      <h4 className="SRF-warning-title">Deletion Warning</h4>
                      <p className="SRF-warning-text">
                        You are requesting to completely remove this item from
                        inventory. This action requires approval and cannot be
                        undone.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="SRF-right-column">
                <div className="SRF-request-form">
                  <div className="SRF-form-header">
                    <h3 className="SRF-form-title">Request Details</h3>
                  </div>

                  <div className="SRF-form-content">
                    <div className="SRF-form-group">
                      <label className="SRF-form-label">Request Type:</label>
                      <div className="SRF-select-wrapper">
                        <select
                          className="SRF-select-request-type"
                          value={requestType}
                          onChange={(e) => setRequestType(e.target.value)}
                        >
                          <option value="update">Update Quantity</option>
                          <option value="delete">Delete Stock Item</option>
                        </select>
                        <div className="SRF-select-arrow">▼</div>
                      </div>
                    </div>

                    {requestType === "update" && (
                      <div className="SRF-form-group">
                        <label className="SRF-form-label">
                          Proposed Quantity:
                        </label>
                        <div className="SRF-quantity-control">
                          <button
                            type="button"
                            className="SRF-quantity-btn SRF-decrement"
                            onClick={() => {
                              const current =
                                parseInt(proposedQuantityInput, 10) || 0;
                              setProposedQuantityInput(
                                Math.max(0, current - 1).toString()
                              );
                            }}
                            disabled={
                              (parseInt(proposedQuantityInput, 10) || 0) <= 0
                            }
                          >
                            <span className="SRF-btn-icon">−</span>
                          </button>
                          <input
                            className="SRF-quantity-input"
                            type="text"
                            value={proposedQuantityInput}
                            onChange={handleQuantityChange}
                            placeholder="Enter quantity"
                          />
                          <button
                            type="button"
                            className="SRF-quantity-btn SRF-increment"
                            onClick={() => {
                              const current =
                                parseInt(proposedQuantityInput, 10) || 0;
                              setProposedQuantityInput(
                                (current + 1).toString()
                              );
                            }}
                          >
                            <span className="SRF-btn-icon">+</span>
                          </button>
                        </div>
                        {stock &&
                          requestType === "update" &&
                          parseInt(proposedQuantityInput, 10) !==
                            stock.product_quantity && (
                            <div className="SRF-quantity-diff">
                              <span
                                className={
                                  parseInt(proposedQuantityInput, 10) >
                                  stock.product_quantity
                                    ? "SRF-increase"
                                    : "SRF-decrease"
                                }
                              >
                                {parseInt(proposedQuantityInput, 10) >
                                stock.product_quantity
                                  ? "+"
                                  : ""}
                                {parseInt(proposedQuantityInput, 10) -
                                  stock.product_quantity}
                              </span>{" "}
                              from current quantity
                            </div>
                          )}
                      </div>
                    )}

                    <div className="SRF-form-group">
                      <label className="SRF-form-label">
                        Reason: <span className="SRF-required">*</span>
                      </label>
                      <textarea
                        className={`SRF-reason-input ${
                          !reason.trim() ? "SRF-input-error" : ""
                        }`}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please provide a detailed reason for this request..."
                        rows={4}
                      />
                      {!reason.trim() && (
                        <div className="SRF-form-hint">
                          <span className="SRF-hint-icon">ℹ️</span>
                          Reason is required for approval
                        </div>
                      )}
                    </div>

                    <div className="SRF-requester-info">
                      <div className="SRF-requester-label">Requested by:</div>
                      <div className="SRF-requester-value">
                        {user?.username || "Unknown"}
                      </div>
                    </div>
                  </div>

                  <div className="SRF-actions">
                    <button
                      type="button"
                      className="SRF-cancel-btn"
                      onClick={() => navigate("/mystock-change-requests")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="SRF-submit-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="SRF-submit-spinner"></span>
                          Processing...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="SRF-not-found">
            <div className="SRF-not-found-icon">📦</div>
            <p className="SRF-not-found-message">
              Stock information not found.
            </p>
            <button
              className="SRF-back-btn"
              onClick={() => navigate("/mystock-change-requests")}
            >
              Back to Requests
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockChangeRequestForm;
