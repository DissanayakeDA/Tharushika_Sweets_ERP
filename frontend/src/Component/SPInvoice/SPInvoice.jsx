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
    const input = document.getElementById("invoice-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 200;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const fileName = `Invoice_${buyerId}.pdf`;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);

      localStorage.setItem("SPrecentInvoice", fileName);
    });
  };

  const handleSubmit = async () => {
    generatePDF();
  
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
  
    console.log("Sending Sale Data:", indirectsaleData);
  
    try {
      // Save the sale data
      const saleResponse = await axios.post(
        "http://localhost:5000/api/indirectsales/add", // Updated endpoint
        indirectsaleData
      );

  
      if (saleResponse.data.success) {
        console.log("Sale recorded successfully");
      } else {
        console.log("Error recording sale");
      }
    } catch (error) {
      console.error(
        "Error submitting sale:",
        error.response ? error.response.data : error.message
      );
    }
  
        // Clear local storage and navigate
        localStorage.removeItem("SPissueinvoiceData");
        localStorage.removeItem("SPissuetotalBill");
        localStorage.removeItem("SPissuebuyerId");
        navigate("/spsales"); // Navigate to sales records page
      
    
  };
  return (
    <div className="invoice-container">
      <SPNav />
      <div id="invoice-content">
        <div className="invoice-header">
          <h2 className="invoice-title">INVOICE</h2>
          <hr className="divider" />
          <img src="./images/logo.png" alt="Logo" className="invoice-logo" />
          <hr className="divider" />
        </div>

        <div className="buyer-details">
          <p><strong>Buyer ID:</strong> {buyerId}</p>
          <p><strong>Date:</strong> {currentTime.toLocaleDateString()}</p>
          <p><strong>Time:</strong> {currentTime.toLocaleTimeString()}</p>
        </div>

        <div className="items-section">
          <h3 className="items-header">Item Details</h3>
          {invoiceData.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-sl">{index + 1}.</div>
              <div className="item-description">
                <strong>{item.selectedItem}</strong>
                <p>Price: ${item.price.toFixed(2)} | Quantity: {item.quantity}</p>
              </div>
              <div className="item-total">Total: ${item.total.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="total-section">
          <p className="final-bill"><strong>SubTotal:</strong> ${totalBill.toFixed(2)}</p>
          <h3 className="final-total"><strong>Total:</strong> ${totalBill.toFixed(2)}</h3>
        </div>
      </div>

      <div className="button-container">
        <button className="back-button" onClick={handleBack}>Back</button>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default SPInvoice;