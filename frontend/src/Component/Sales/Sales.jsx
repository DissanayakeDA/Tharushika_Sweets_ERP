import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sales.css"; 
import Nav from "../Nav/Nav";
import { Link } from "react-router-dom";
import jsPDF from "jspdf"; 
import HeadBar from "../HeadBar/HeadBar";

function Spsales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("default");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

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

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      updatedSales = updatedSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    // Apply price range filter
    if (priceRange.min !== "" && priceRange.max !== "") {
      updatedSales = updatedSales.filter((sale) => {
        return sale.totalAmount >= Number(priceRange.min) && 
               sale.totalAmount <= Number(priceRange.max);
      });
    }

    // Apply status filter
    if (filterOption !== "default") {
      switch (filterOption) {
        case "date-newest":
          updatedSales.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "date-oldest":
          updatedSales.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case "price-low-high":
          updatedSales.sort((a, b) => a.totalAmount - b.totalAmount);
          break;
        case "price-high-low":
          updatedSales.sort((a, b) => b.totalAmount - a.totalAmount);
          break;
        case "status-pending":
          updatedSales = updatedSales.filter(sale => sale.status === "pending");
          break;
        case "status-completed":
          updatedSales = updatedSales.filter(sale => sale.status === "completed");
          break;
        case "status-cancelled":
          updatedSales = updatedSales.filter(sale => sale.status === "cancelled");
          break;
        default:
          break;
      }
    }

    setFilteredSales(updatedSales);
  }, [searchQuery, filterOption, dateRange, priceRange, sales]);

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
      <Nav />
      <HeadBar />
      <div className="spsales-container">
        <div className="header">
          <h2 className="spsales-title">SP Sales Records</h2>
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <input
              type="search"
              placeholder="Search Here"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Date Range:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="date-input"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="date-input"
            />
          </div>

          <div className="filter-group">
            <label>Price Range:</label>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="price-input"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="price-input"
            />
          </div>

          <div className="filter-group">
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
              <option value="status-pending">Status: Pending</option>
              <option value="status-completed">Status: Completed</option>
              <option value="status-cancelled">Status: Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="spsales-table">
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

export default Spsales;
