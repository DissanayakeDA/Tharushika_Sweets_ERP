import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SPSales.css"; 
import SalesNav from "../SalesNav/SalesNav";
import { Link } from "react-router-dom";
import jsPDF from "jspdf"; 
import HeadBar from "../HeadBar/HeadBar";

function SPSales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("default");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sales")
      .then((response) => {
        if (response.data.success) {
          setSales(response.data.sales);
          setFilteredSales(response.data.sales);
        }
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
      });
  }, []);

  const viewDetails = (invoiceId) => {
    axios
      .get(`http://localhost:5000/api/sales/${invoiceId}`)
      .then((response) => {
        if (response.data.success) {
          setSelectedSale(response.data.sale);
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });
  };

  useEffect(() => {
    let updatedSales = [...sales];

    if (searchQuery) {
      updatedSales = updatedSales.filter((sale) =>
        Object.values(sale).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (filterOption !== "default") {
      if (filterOption === "date-newest") {
        updatedSales.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (filterOption === "date-oldest") {
        updatedSales.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else if (filterOption === "price-low-high") {
        updatedSales.sort((a, b) => a.totalAmount - b.totalAmount);
      } else if (filterOption === "price-high-low") {
        updatedSales.sort((a, b) => b.totalAmount - a.totalAmount);
      }
    }

    setFilteredSales(updatedSales);
  }, [searchQuery, filterOption, sales]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.setTextColor(17, 48, 81);
    doc.text("Direct Sales Report", 105, 15, null, null, "center");
  
    let yOffset = 25; 
  
    filteredSales.forEach((sale, i) => {
      if (yOffset > 260) { 
        doc.addPage(); 
        yOffset = 20; 
      }
  
      doc.setFontSize(12);
      doc.setTextColor(17, 48, 81);
      doc.text(`Sale ${i + 1}`, 15, yOffset);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Sales ID: ${sale._id}`, 20, yOffset + 7);
      doc.text(`Invoice ID: ${sale.invoiceId}`, 20, yOffset + 14);
      doc.text(`Buyer ID: ${sale.buyerId}`, 20, yOffset + 21);
      doc.text(`Date: ${sale.date}`, 20, yOffset + 28);
      doc.text(`Total Amount: ${sale.totalAmount}`, 20, yOffset + 35);
  
      yOffset += 45; 
    });
  
    doc.save("Direct_Sales_Report.pdf");
  };
  

  return (
    <div>
      <SalesNav />
      <HeadBar />
      <div className="sales-container">
        <div className="header">
          <h2 className="sales-title">Sales Records</h2>
        </div>

        <div className="table-controls">
          <input
            type="search"
            placeholder="Search Here"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="filter-select"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="default">Filter By</option>
            <option value="date-newest">Date: Newest First</option>
            <option value="date-oldest">Date: Oldest First</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>

        <div className="table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>BuyerID</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.invoiceId}>
                  <td>{sale.invoiceId}</td>
                  <td>{sale.buyerId}</td>
                  <td>{new Date(sale.date).toLocaleString()}</td>
                  <td>${sale.totalAmount.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => viewDetails(sale.invoiceId)}
                      className="view-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="report-btn-container">
            <button onClick={generatePDF} className="report-btn">
              Download Report
            </button>
          </div>
        </div>

        {showModal && selectedSale && (
          <div className="modal">
            <div className="modal-content">
              <h3>Invoice Details</h3>
              <p>
                <strong>Invoice ID:</strong> {selectedSale.invoiceId}
              </p>
              <p>
                <strong>Date:</strong> {new Date(selectedSale.date).toLocaleString()}
              </p>
              <p>
                <strong>Total Amount:</strong> ${selectedSale.totalAmount.toFixed(2)}
              </p>

              <h4>Items</h4>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button onClick={() => setShowModal(false)} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SPSales;
