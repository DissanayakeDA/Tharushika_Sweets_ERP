import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; 
import html2canvas from "html2canvas"; 
import "./Invoice.css";

function Invoice() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [buyerId, setBuyerId] = useState(""); 
  const [currentTime, setCurrentTime] = useState(new Date()); // State for real-time

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from localStorage
    const data = JSON.parse(localStorage.getItem("invoiceData")) || [];
    const bill = localStorage.getItem("totalBill") || 0;
    const buyer = localStorage.getItem("buyerId") || "";

    setInvoiceData(data);
    setTotalBill(parseFloat(bill));
    setBuyerId(buyer);

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    navigate("/issueitems");
  };

  const generatePDF = () => {
    const input = document.getElementById("invoice-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 200; 
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const fileName = `Invoice_${buyerId}.pdf`; 
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);

      localStorage.setItem("recentInvoice", fileName);
      console.log("Stored File Name:", fileName);
    });
  };

  const handleSubmit = () => {
    generatePDF();
    localStorage.removeItem("invoiceData");
    localStorage.removeItem("totalBill");
    localStorage.removeItem("buyerId");
    navigate("/viewsales");
  };

  return (
    <div className="invoice-container">
      <Nav />
      <div id="invoice-content">
        <div className="invoice-header">
          <h2 className="invoice-title">INVOICE</h2>
          <hr className="divider" />
          <img src="/images/logo.png" alt="Logo" className="invoice-logo" />
          <hr className="divider" />
        </div>

        <div className="buyer-details">
          <p>
            <strong>Buyer ID:</strong> {buyerId}
          </p>
          <p>
            <strong>Date:</strong> {currentTime.toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <div className="items-section">
          <h3 className="items-header">Item Details</h3>
          {invoiceData.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-sl">{index + 1}.</div>
              <div className="item-description">
                <strong>{item.selectedItem}</strong>
                <p>
                  Price: ${item.price.toFixed(2)} | Quantity: {item.quantity}
                </p>
              </div>
              <div className="item-total">Total: ${item.total.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="total-section">
          <p className="final-bill">
            <strong>SubTotal:</strong> ${totalBill.toFixed(2)}
          </p>
          <p className="final-bill">
            <strong>Tax (12%):</strong> ${(totalBill * 0.12).toFixed(2)}
          </p>
          <h3 className="final-total">
            <strong>Total:</strong> ${(totalBill * 1.12).toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="button-container">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Invoice;
