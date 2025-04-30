import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Invoice.css";
import axios from "axios";

function Invoice() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [buyerId, setBuyerId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from localStorage
    const data = JSON.parse(localStorage.getItem("issueinvoiceData")) || [];
    const bill = localStorage.getItem("issuetotalBill") || 0;
    const buyer = localStorage.getItem("issuebuyerId") || "";

    setInvoiceData(data);
    setTotalBill(parseFloat(bill));
    setBuyerId(buyer);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    navigate("/issueitems");
  };

  const generatePDF = () => {
    const input = document.getElementById("directbuyerinvoice-content");
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
    generatePDF();

    const saleData = {
      buyerId,
      items: invoiceData.map((item) => ({
        itemName: item.selectedItem,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      totalAmount: totalBill,
    };

    console.log("Sending Sale Data:", saleData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/sales/add",
        saleData
      );
      console.log("Response:", response.data);
      if (response.data.success) {
        console.log("Sale recorded successfully");

        // Update the sales count in localStorage to trigger update in Home component
        const today = new Date().toISOString().split("T")[0];
        const todaySales = JSON.parse(
          localStorage.getItem("todaySales") || "{}"
        );

        // Increment count for today or initialize if first sale of the day
        todaySales[today] = (todaySales[today] || 0) + 1;
        localStorage.setItem("todaySales", JSON.stringify(todaySales));

        // Optionally: Broadcast an event to notify other components
        window.dispatchEvent(new Event("newSaleAdded"));
      } else {
        console.log("Error recording sale");
      }
    } catch (error) {
      console.error(
        "Error submitting sale:",
        error.response ? error.response.data : error.message
      );
    }

    localStorage.removeItem("issueinvoiceData");
    localStorage.removeItem("issuetotalBill");
    localStorage.removeItem("issuebuyerId");
    navigate("/viewsales");
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="directbuyerinvoice-container">
      <Nav />
      <div id="directbuyerinvoice-content">
        <div className="directbuyerinvoice-header">
          <div className="directbuyerinvoice-header-top">
            <img
              src="./images/logo.png"
              alt="Logo"
              className="directbuyerinvoice-logo"
            />
            <h2 className="directbuyerinvoice-title">INVOICE</h2>
            <div className="directbuyerinvoice-number">
              #{buyerId.substring(0, 5)}
            </div>
          </div>
          <div className="directbuyerinvoice-divider-container">
            <div className="directbuyerinvoice-divider"></div>
          </div>
        </div>

        <div className="directbuyerinvoice-info-section">
          <div className="directbuyerinvoice-buyer-details">
            <h3 className="directbuyerinvoice-section-title">CUSTOMER</h3>
            <p className="directbuyerinvoice-buyer-id">ID: {buyerId}</p>
          </div>
          <div className="directbuyerinvoice-date-details">
            <h3 className="directbuyerinvoice-section-title">INVOICE INFO</h3>
            <p>
              <span>Date:</span> {formatDate(currentTime)}
            </p>
            <p>
              <span>Time:</span> {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="directbuyerinvoice-items-section">
          <div className="directbuyerinvoice-items-header">
            <div className="directbuyerinvoice-item-header-sl">#</div>
            <div className="directbuyerinvoice-item-header-desc">
              Description
            </div>
            <div className="directbuyerinvoice-item-header-price">Price</div>
            <div className="directbuyerinvoice-item-header-qty">Qty</div>
            <div className="directbuyerinvoice-item-header-total">Total</div>
          </div>

          {invoiceData.map((item, index) => (
            <div key={index} className="directbuyerinvoice-item-row">
              <div className="directbuyerinvoice-item-sl">{index + 1}</div>
              <div className="directbuyerinvoice-item-description">
                {item.selectedItem}
              </div>
              <div className="directbuyerinvoice-item-price">
                ${item.price.toFixed(2)}
              </div>
              <div className="directbuyerinvoice-item-qty">{item.quantity}</div>
              <div className="directbuyerinvoice-item-total">
                ${item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="directbuyerinvoice-total-section">
          <div className="directbuyerinvoice-total-row">
            <span>Subtotal:</span>
            <span>${totalBill.toFixed(2)}</span>
          </div>
          <div className="directbuyerinvoice-total-row directbuyerinvoice-tax">
            <span>Tax:</span>
            <span>$0.00</span>
          </div>
          <div className="directbuyerinvoice-divider-sm"></div>
          <div className="directbuyerinvoice-total-row directbuyerinvoice-grand-total">
            <span>Total:</span>
            <span>${totalBill.toFixed(2)}</span>
          </div>
        </div>

        <div className="directbuyerinvoice-footer">
          <p>Thank you for your purchase!</p>
          <p className="directbuyerinvoice-footer-company">
            Direct Buyer Solutions Inc.
          </p>
        </div>
      </div>

      <div className="directbuyerinvoice-button-container">
        <button className="directbuyerinvoice-back-button" onClick={handleBack}>
          Back
        </button>
        <button
          className="directbuyerinvoice-submit-button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Invoice;
