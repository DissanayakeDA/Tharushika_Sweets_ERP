import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GMviewsales.css";
import GMNav from "../GMNav/GMNav";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import HeadBar from "../HeadBar/HeadBar";

function GMviewsales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [hoveredRow, setHoveredRow] = useState(null);
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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterOption("default");
    setDateRange({ start: "", end: "" });
    setPriceRange({ min: "", max: "" });
    setSortConfig({ key: null, direction: null });
  };

  useEffect(() => {
    let updatedSales = [...sales];

    // Search filter
    if (searchQuery) {
      updatedSales = updatedSales.filter((sale) =>
        Object.values(sale).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      updatedSales = updatedSales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      updatedSales = updatedSales.filter((sale) => {
        const amount = sale.totalAmount;
        const minValid =
          priceRange.min === "" || amount >= parseFloat(priceRange.min);
        const maxValid =
          priceRange.max === "" || amount <= parseFloat(priceRange.max);
        return minValid && maxValid;
      });
    }

    // Dropdown filter
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

    // Column sorting
    if (sortConfig.key) {
      updatedSales.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.key === "date") {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          if (sortConfig.direction === "ascending") {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        } else {
          if (sortConfig.direction === "ascending") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        }
      });
    }

    setFilteredSales(updatedSales);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filterOption, sales, sortConfig, dateRange, priceRange]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <div>
      <GMNav />
      <HeadBar />
      <div className="dbIssue-sales-container">
        <div className="dbIssue-header">
          <h2 className="dbIssue-sales-title">Sales Records</h2>
        </div>

        <div className="dbIssue-advanced-filters">
          <div className="dbIssue-search-container">
            <input
              type="search"
              placeholder="Search any field..."
              className="dbIssue-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="dbIssue-filter-container">
            <div className="dbIssue-filter-group">
              <label>Date Range:</label>
              <div className="dbIssue-date-inputs">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="dbIssue-date-input"
                />
                <span>to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="dbIssue-date-input"
                />
              </div>
            </div>

            <div className="dbIssue-filter-group">
              <label>Price Range:</label>
              <div className="dbIssue-price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="dbIssue-price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="dbIssue-price-input"
                />
              </div>
            </div>

            <div className="dbIssue-filter-group">
              <select
                className="dbIssue-filter-select"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
              >
                <option value="default">Quick Sort</option>
                <option value="date-newest">Date: Newest First</option>
                <option value="date-oldest">Date: Oldest First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>

            <button onClick={resetFilters} className="dbIssue-reset-btn">
              Reset Filters
            </button>
          </div>
        </div>

        <div className="dbIssue-results-summary">
          <span>
            Showing {currentItems.length} of {filteredSales.length} sales
          </span>
          <div className="dbIssue-items-per-page">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>
        </div>

        <div className="dbIssue-table-container">
          <table className="dbIssue-sales-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("invoiceId")}
                  className="dbIssue-sortable-header"
                >
                  Invoice ID{getSortIndicator("invoiceId")}
                </th>
                <th
                  onClick={() => handleSort("buyerId")}
                  className="dbIssue-sortable-header"
                >
                  BuyerID{getSortIndicator("buyerId")}
                </th>
                <th
                  onClick={() => handleSort("date")}
                  className="dbIssue-sortable-header"
                >
                  Date{getSortIndicator("date")}
                </th>
                <th
                  onClick={() => handleSort("totalAmount")}
                  className="dbIssue-sortable-header"
                >
                  Total Amount{getSortIndicator("totalAmount")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sale) => (
                <tr
                  key={sale.invoiceId}
                  className={
                    hoveredRow === sale.invoiceId ? "dbIssue-hovered-row" : ""
                  }
                  onMouseEnter={() => setHoveredRow(sale.invoiceId)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td>{sale.invoiceId}</td>
                  <td>{sale.buyerId}</td>
                  <td>{new Date(sale.date).toLocaleString()}</td>
                  <td className="dbIssue-amount-cell">
                    ${sale.totalAmount.toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() => viewDetails(sale.invoiceId)}
                      className="dbIssue-view-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSales.length === 0 && (
            <div className="dbIssue-no-results">
              No sales records match your filters. Try adjusting your search
              criteria.
            </div>
          )}
        </div>

        <div className="dbIssue-pagination-controls">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="dbIssue-pagination-btn"
          >
            Previous
          </button>

          <div className="dbIssue-page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageToShow}
                  onClick={() => paginate(pageToShow)}
                  className={`dbIssue-page-number ${
                    currentPage === pageToShow ? "dbIssue-active" : ""
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="dbIssue-ellipsis">...</span>
                <button
                  onClick={() => paginate(totalPages)}
                  className={`dbIssue-page-number ${
                    currentPage === totalPages ? "dbIssue-active" : ""
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="dbIssue-pagination-btn"
          >
            Next
          </button>
        </div>

        <div className="dbIssue-report-controls">
          <div className="dbIssue-report-btn-container">
            <button onClick={generatePDF} className="dbIssue-report-btn">
              Download PDF Report
            </button>
          </div>
        </div>

        {showModal && selectedSale && (
          <div className="dbIssue-modal">
            <div className="dbIssue-modal-content">
              <div className="dbIssue-modal-header">
                <h3>Invoice Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="dbIssue-close-modal"
                >
                  ×
                </button>
              </div>

              <div className="dbIssue-invoice-details">
                <div className="dbIssue-invoice-header">
                  <div className="dbIssue-invoice-info">
                    <p>
                      <strong>Invoice ID:</strong> {selectedSale.invoiceId}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(selectedSale.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="dbIssue-buyer-info">
                    <p>
                      <strong>Buyer ID:</strong> {selectedSale.buyerId}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> $
                      {selectedSale.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <h4>Items</h4>
                <table className="dbIssue-items-table">
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
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="dbIssue-total-label">
                        Total
                      </td>
                      <td className="dbIssue-total-amount">
                        ${selectedSale.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="dbIssue-modal-actions">
                  <button
                    onClick={() => setShowModal(false)}
                    className="dbIssue-modal-btn dbIssue-cancel-btn"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GMviewsales;
