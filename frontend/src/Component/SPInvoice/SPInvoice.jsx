import React, { useEffect, useState } from "react";
import SPNav from "../SalesNav/SalesNav";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./SPInvoice.css";
import axios from "axios";

function SPInvoice() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [buyerId, setBuyerId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("SPissueinvoiceData")) || [];
    const bill = localStorage.getItem("SPissuetotalBill") || 0;
    const buyer = localStorage.getItem("SPissuebuyerId") || "";

    setInvoiceData(data);
    setTotalBill(parseFloat(bill));
    setBuyerId(buyer);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    navigate("/spissueitems");
  };

  const generatePDF = () => {
    return new Promise((resolve) => {
      const input = document.getElementById("spinvoice-content");
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = 200;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const fileName = `Invoice_${buyerId}.pdf`;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);

        localStorage.setItem("SPrecentInvoice", fileName);
        resolve();
      });
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the sale data
      const indirectsaleData = {
        buyerId,
        items: invoiceData.map((item) => ({
          itemName: item.selectedItem,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        totalAmount: totalBill,
      };

      console.log(
        "Sending Sale Data:",
        JSON.stringify(indirectsaleData, null, 2)
      );
      console.log("Buyer ID:", buyerId);
      console.log("Total Bill:", totalBill);
      console.log("Items:", JSON.stringify(invoiceData, null, 2));

      // Save the sale data to the database FIRST
      const saleResponse = await axios.post(
        "http://localhost:5000/api/indirectsales/add",
        indirectsaleData
      );

      console.log(
        "Server Response:",
        JSON.stringify(saleResponse.data, null, 2)
      );

      if (saleResponse.data.success) {
        console.log("Sale recorded successfully");

        // Clear local storage
        localStorage.removeItem("SPissueinvoiceData");
        localStorage.removeItem("SPissuetotalBill");
        localStorage.removeItem("SPissuebuyerId");

        // Show success message
        alert("Sale recorded successfully!");

        // THEN generate and download the PDF
        await generatePDF();

        // Navigate to sales records page
        navigate("/spsales");
      } else {
        setError(
          "Failed to record sale: " +
            (saleResponse.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error submitting sale:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);

      // More detailed error message
      let errorMessage = "Error submitting sale: ";
      if (error.response) {
        errorMessage +=
          error.response.data.message ||
          `Server responded with status ${error.response.status}`;
        if (error.response.data.details) {
          errorMessage +=
            "\nDetails: " +
            JSON.stringify(error.response.data.details, null, 2);
        }
      } else if (error.request) {
        errorMessage +=
          "No response received from server. Please check your connection.";
      } else {
        errorMessage += error.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="spinvoice-container">
      <SPNav />
      <div id="spinvoice-content">
        <div className="spinvoice-header">
          <div className="spinvoice-header-top">
            <h2 className="spinvoice-title">INVOICE</h2>
            <div className="spinvoice-number">
              #{buyerId}-{new Date().getTime().toString().slice(-6)}
            </div>
          </div>
          <div className="spinvoice-logo-container">
            <img
              src="/images/logo.png"
              alt="Company Logo"
              className="spinvoice-logo"
              onError={(e) => {
                e.target.style.display = "none";
                const logoContainer = e.target.parentElement;
                if (logoContainer) {
                  logoContainer.style.display = "none";
                }
              }}
            />
          </div>
          <div className="spinvoice-divider-container">
            <div className="spinvoice-divider"></div>
          </div>
        </div>

        <div className="spinvoice-info-section">
          <div className="spinvoice-buyer-details">
            <h4 className="spinvoice-section-title">Buyer Information</h4>
            <p className="spinvoice-buyer-id">ID: {buyerId}</p>
          </div>
          <div className="spinvoice-date-details">
            <h4 className="spinvoice-section-title">Invoice Details</h4>
            <p>
              <span>Date:</span> {currentTime.toLocaleDateString()}
            </p>
            <p>
              <span>Time:</span> {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="spinvoice-items-section">
          <div className="spinvoice-items-header">
            <div className="spinvoice-item-header-sl">No.</div>
            <div className="spinvoice-item-header-desc">Description</div>
            <div className="spinvoice-item-header-price">Price</div>
            <div className="spinvoice-item-header-qty">Qty</div>
            <div className="spinvoice-item-header-total">Total</div>
          </div>

          {invoiceData.map((item, index) => (
            <div key={index} className="spinvoice-item-row">
              <div className="spinvoice-item-sl">{index + 1}</div>
              <div className="spinvoice-item-description">
                {item.selectedItem}
              </div>
              <div className="spinvoice-item-price">
                ${item.price.toFixed(2)}
              </div>
              <div className="spinvoice-item-qty">{item.quantity}</div>
              <div className="spinvoice-item-total">
                ${item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="spinvoice-total-section">
          <div className="spinvoice-total-row">
            <div>Subtotal</div>
            <div>${totalBill.toFixed(2)}</div>
          </div>
          <div className="spinvoice-total-row spinvoice-tax">
            <div>Tax (0%)</div>
            <div>$0.00</div>
          </div>
          <div className="spinvoice-divider-sm"></div>
          <div className="spinvoice-total-row spinvoice-grand-total">
            <div>Total</div>
            <div>${totalBill.toFixed(2)}</div>
          </div>
        </div>

        <div className="spinvoice-footer">
          <p>Thank you for your business!</p>
          <p className="spinvoice-footer-company">Your Company Name</p>
        </div>
      </div>

      {error && <div className="spinvoice-error-message">{error}</div>}

      <div className="spinvoice-button-container">
        <button className="spinvoice-back-button" onClick={handleBack}>
          Back
        </button>
        <button
          className="spinvoice-submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default SPInvoice;
