import React, { useEffect, useState } from "react";
import SPNav from "../SalesNav/SalesNav";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./SPReturnInvoice.css";
import axios from "axios";
import HeadBar from "../HeadBar/HeadBar";

function SPReturnInvoice() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [buyerId, setBuyerId] = useState("");
  const [returnMethod, setReturnMethod] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from localStorage
    setInvoiceData(
      JSON.parse(localStorage.getItem("SPreturninvoiceData")) || []
    );
    setTotalBill(parseFloat(localStorage.getItem("SPreturntotalBill")) || 0);
    setBuyerId(localStorage.getItem("SPreturnbuyerId") || "");
    setReturnMethod(localStorage.getItem("SPreturnMethod") || "");

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    navigate("/spreturns");
  };

  const generatePDF = () => {
    const input = document.getElementById("spreturninvoice-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 200;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const fileName = `ReturnInvoice_${buyerId}.pdf`;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);

      localStorage.setItem("SPrecentInvoice", fileName);
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Generate PDF first
      generatePDF();

      const returnData = {
        buyerId,
        returnMethod,
        items: invoiceData.map((item) => ({
          itemId: item.itemId || item.selectedItem,
          itemName: item.selectedItem,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        totalAmount: totalBill,
      };

      console.log("Sending return data:", JSON.stringify(returnData, null, 2));

      const response = await axios.post(
        "http://localhost:5000/api/indirectreturns/add",
        returnData
      );
      console.log("Response from server:", response.data);

      if (response.data.message === "Return added successfully") {
        setSuccess("Return submitted successfully!");

        // Clear local storage
        localStorage.setItem("clearDataFlag", "true");

        // Wait a moment to show success message
        setTimeout(() => {
          navigate("/spviewreturns");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to submit return");
      }
    } catch (error) {
      console.error("Detailed error submitting return:", error);
      console.error("Error response:", error.response?.data);

      // Show more detailed error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error submitting return. Please try again.";
      setError(errorMessage);

      // If there are validation errors, show them
      if (error.response?.data?.details) {
        const validationErrors = Object.values(error.response.data.details)
          .map((err) => err.message)
          .join(", ");
        setError(`Validation errors: ${validationErrors}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="spreturninvoice-container">
      <HeadBar />
      <SPNav />
      <div id="spreturninvoice-content">
        <div className="spreturninvoice-header">
          <div className="spreturninvoice-header-top">
            <h2 className="spreturninvoice-title">RETURN INVOICE</h2>
            <div className="spreturninvoice-number">ID: {buyerId}</div>
          </div>

          <div className="spreturninvoice-logo-container">
            {/* If you have a logo, you can uncomment this */}
            {/* <img className="spreturninvoice-logo" src="/logo.png" alt="Company Logo" /> */}
          </div>

          <div className="spreturninvoice-divider-container">
            <div className="spreturninvoice-divider"></div>
          </div>
        </div>

        <div className="spreturninvoice-info-section">
          <div className="spreturninvoice-buyer-details">
            <h3 className="spreturninvoice-section-title">Buyer Information</h3>
            <p className="spreturninvoice-buyer-id">{buyerId}</p>
            <p>Return Method: {returnMethod}</p>
          </div>

          <div className="spreturninvoice-date-details">
            <h3 className="spreturninvoice-section-title">Invoice Details</h3>
            <p>
              <span>Date:</span> {currentTime.toLocaleDateString()}
            </p>
            <p>
              <span>Time:</span> {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="spreturninvoice-items-section">
          <div className="spreturninvoice-items-header">
            <div className="spreturninvoice-item-header-sl">No.</div>
            <div className="spreturninvoice-item-header-desc">
              Item Description
            </div>
            <div className="spreturninvoice-item-header-price">Price</div>
            <div className="spreturninvoice-item-header-qty">Qty</div>
            <div className="spreturninvoice-item-header-total">Total</div>
          </div>

          {invoiceData.map((item, index) => (
            <div key={index} className="spreturninvoice-item-row">
              <div className="spreturninvoice-item-sl">{index + 1}</div>
              <div className="spreturninvoice-item-description">
                {item.selectedItem}
              </div>
              <div className="spreturninvoice-item-price">
                ${item.price.toFixed(2)}
              </div>
              <div className="spreturninvoice-item-qty">{item.quantity}</div>
              <div className="spreturninvoice-item-total">
                ${item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="spreturninvoice-total-section">
          <div className="spreturninvoice-total-row">
            <span>Subtotal:</span>
            <span>${totalBill.toFixed(2)}</span>
          </div>
          <div className="spreturninvoice-total-row spreturninvoice-tax">
            <span>Tax (0%):</span>
            <span>$0.00</span>
          </div>
          <div className="spreturninvoice-divider-sm"></div>
          <div className="spreturninvoice-total-row spreturninvoice-grand-total">
            <span>Grand Total:</span>
            <span>${totalBill.toFixed(2)}</span>
          </div>
        </div>

        <div className="spreturninvoice-footer">
          <p>Thank you for your business!</p>
          <p className="spreturninvoice-footer-company">Tharushika Sweets</p>
        </div>
      </div>

      {error && <div className="spreturninvoice-error-message">{error}</div>}
      {success && (
        <div className="spreturninvoice-success-message">{success}</div>
      )}

      <div className="spreturninvoice-button-container">
        <button
          className="spreturninvoice-back-button"
          onClick={handleBack}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          className="spreturninvoice-submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default SPReturnInvoice;
