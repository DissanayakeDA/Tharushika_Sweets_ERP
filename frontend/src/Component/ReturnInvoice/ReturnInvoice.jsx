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
  const [returnMethod, setReturnMethod] = useState(""); // Store return method
  const [currentTime, setCurrentTime] = useState(new Date()); // State for real-time

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from localStorage
    setInvoiceData(JSON.parse(localStorage.getItem("returninvoiceData")) || []);
    setTotalBill(parseFloat(localStorage.getItem("returntotalBill")) || 0);
    setBuyerId(localStorage.getItem("returnbuyerId") || "");
    setReturnMethod(localStorage.getItem("returnMethod") || ""); // Fetch return method
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    navigate("/directreturns");
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

  const handleSubmit = async () => {
    console.log("Starting handleSubmit"); // Debug log
    generatePDF(); // Generate the invoice PDF
  
    const returnData = {
      buyerId,
      returnMethod,
      items: invoiceData.map((item) => ({
        itemName: item.selectedItem,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      totalAmount: returnMethod === "issueMoney" ? totalBill : 0, // No price change if issuing product
    };
  
    console.log("Return Data:", returnData); // Debug log
  
    try {
      const response = await axios.post("http://localhost:5000/api/returns/add", returnData);
      console.log("API Response:", response.data); // Debug log
  
      if (response.data.success) {
        console.log("Return recorded successfully");
  
        // Clear localStorage data
        localStorage.removeItem("returninvoiceData");
        localStorage.removeItem("returnbuyerId");
        localStorage.removeItem("returntotalBill");
        localStorage.removeItem("returnMethod");
  
        console.log("Navigating to /viewReturns"); // Debug log
        navigate("/viewReturns");
      } else {
        console.log("Error recording return");
      }
    } catch (error) {
      console.error("Error submitting return:", error.response ? error.response.data : error.message);
    }
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
          
          <h3 className="final-total">
            <strong>Total:</strong> ${totalBill.toFixed(2)}
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

export default ReturnInvoice;