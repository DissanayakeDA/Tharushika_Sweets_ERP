import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ReturnInvoice.css";
import axios from "axios";

function ReturnInvoice() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [buyerId, setBuyerId] = useState("");
  const [returnMethod, setReturnMethod] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    setInvoiceData(JSON.parse(localStorage.getItem("returninvoiceData")) || []);
    setTotalBill(parseFloat(localStorage.getItem("returntotalBill")) || 0);
    setBuyerId(localStorage.getItem("returnbuyerId") || "");
    setReturnMethod(localStorage.getItem("returnMethod") || "");

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    navigate("/directreturns");
  };

  const generatePDF = () => {
    const input = document.getElementById("directbuyerreturninvoice-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 200;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const fileName = `ReturnInvoice_${buyerId}.pdf`;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);

      localStorage.setItem("recentInvoice", fileName);
      console.log("Stored File Name:", fileName);
    });
  };

  const handleSubmit = async () => {
    console.log("Starting handleSubmit");
    generatePDF();

    const returnData = {
      buyerId,
      returnMethod,
      items: invoiceData.map((item) => ({
        itemName: item.selectedItem,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      totalAmount: returnMethod === "issueMoney" ? totalBill : 0,
    };

    console.log("Return Data:", returnData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/returns/add",
        returnData
      );
      console.log("API Response:", response.data);

      if (response.data.success) {
        console.log("Return recorded successfully");
        localStorage.setItem("clearDataFlag", "true");
        console.log("Navigating to /viewReturns");
        navigate("/viewReturns");
      } else {
        console.log("Error recording return");
      }
    } catch (error) {
      console.error(
        "Error submitting return:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="directbuyerreturninvoice-container">
      <Nav />
      <div id="directbuyerreturninvoice-content">
        <div className="directbuyerreturninvoice-header">
          <div className="directbuyerreturninvoice-header-top">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="directbuyerreturninvoice-logo"
            />
            <h2 className="directbuyerreturninvoice-title">RETURN INVOICE</h2>
            <div className="directbuyerreturninvoice-number">
              RTN-#{buyerId.substring(0, 5)}
            </div>
          </div>
          <div className="directbuyerreturninvoice-divider-container">
            <div className="directbuyerreturninvoice-divider"></div>
          </div>
        </div>

        <div className="directbuyerreturninvoice-info-section">
          <div className="directbuyerreturninvoice-buyer-details">
            <h3 className="directbuyerreturninvoice-section-title">CUSTOMER</h3>
            <p className="directbuyerreturninvoice-buyer-id">ID: {buyerId}</p>
            <p>
              <span>Return Method:</span>{" "}
              {returnMethod === "issueMoney" ? "Cash Refund" : "Exchange"}
            </p>
          </div>
          <div className="directbuyerreturninvoice-date-details">
            <h3 className="directbuyerreturninvoice-section-title">
              INVOICE INFO
            </h3>
            <p>
              <span>Date:</span> {formatDate(currentTime)}
            </p>
            <p>
              <span>Time:</span> {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="directbuyerreturninvoice-items-section">
          <div className="directbuyerreturninvoice-items-header">
            <div className="directbuyerreturninvoice-item-header-sl">#</div>
            <div className="directbuyerreturninvoice-item-header-desc">
              Description
            </div>
            <div className="directbuyerreturninvoice-item-header-price">
              Price
            </div>
            <div className="directbuyerreturninvoice-item-header-qty">Qty</div>
            <div className="directbuyerreturninvoice-item-header-total">
              Total
            </div>
          </div>
          {invoiceData.map((item, index) => (
            <div key={index} className="directbuyerreturninvoice-item-row">
              <div className="directbuyerreturninvoice-item-sl">
                {index + 1}
              </div>
              <div className="directbuyerreturninvoice-item-description">
                {item.selectedItem}
              </div>
              <div className="directbuyerreturninvoice-item-price">
                ${item.price.toFixed(2)}
              </div>
              <div className="directbuyerreturninvoice-item-qty">
                {item.quantity}
              </div>
              <div className="directbuyerreturninvoice-item-total">
                ${item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="directbuyerreturninvoice-total-section">
          <div className="directbuyerreturninvoice-total-row">
            <span>Subtotal:</span>
            <span>${totalBill.toFixed(2)}</span>
          </div>
          <div className="directbuyerreturninvoice-total-row directbuyerreturninvoice-tax">
            <span>Tax:</span>
            <span>$0.00</span>
          </div>
          <div className="directbuyerreturninvoice-divider-sm"></div>
          <div className="directbuyerreturninvoice-total-row directbuyerreturninvoice-grand-total">
            <span>Total:</span>
            <span>${totalBill.toFixed(2)}</span>
          </div>
        </div>

        <div className="directbuyerreturninvoice-footer">
          <p>Thank you for your business!</p>
          <p>For any inquiries, please contact customer service.</p>
        </div>
      </div>

      <div className="directbuyerreturninvoice-button-container">
        <button
          className="directbuyerreturninvoice-back-button"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="directbuyerreturninvoice-submit-button"
          onClick={handleSubmit}
        >
          Submit Return
        </button>
      </div>
    </div>
  );
}

export default ReturnInvoice;
