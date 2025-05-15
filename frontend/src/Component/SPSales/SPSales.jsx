import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SPSales.css";
import SalesNav from "../SalesNav/SalesNav";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import HeadBar from "../HeadBar/HeadBar";

function IndirectBuyerSales() {
  const [indirectsales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Advanced filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [status, setStatus] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hoveredRow, setHoveredRow] = useState(null);

  const [loading, setLoading] = useState(true);

  // Function to fetch sales data
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/indirectsales"
      );
      console.log("Sales response:", response.data);
      if (response.data.success) {
        setSales(response.data.sales);
        setFilteredSales(response.data.sales);
      } else {
        console.error("Failed to fetch sales:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();

    // Set up an interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchSalesData, 30000);

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Handle search and apply all filters
  useEffect(() => {
    let results = [...indirectsales];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((sale) =>
        Object.keys(sale).some((key) => {
          let fieldValue = sale[key];

          if (key === "date") {
            fieldValue = new Date(fieldValue).toLocaleString();
          } else if (typeof fieldValue === "number") {
            fieldValue = fieldValue.toString();
          } else if (typeof fieldValue !== "string") {
            return false;
          }

          return fieldValue.toLowerCase().includes(query);
        })
      );
    }

    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      results = results.filter((sale) => new Date(sale.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      results = results.filter((sale) => new Date(sale.date) <= end);
    }

    // Apply price range filter
    if (minPrice) {
      results = results.filter(
        (sale) => sale.totalAmount >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      results = results.filter(
        (sale) => sale.totalAmount <= parseFloat(maxPrice)
      );
    }

    // Apply status filter if implemented
    if (status) {
      results = results.filter((sale) => sale.status === status);
    }

    // Apply sorting
    if (sortField) {
      results.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredSales(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchQuery,
    indirectsales,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    status,
    sortField,
    sortDirection,
  ]);

  const viewDetails = async (invoiceId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/indirectsales/${invoiceId}`
      );
      if (response.data.success) {
        setSelectedSale(response.data.sale);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching sale details:", error);
    }
  };

  // Search Function
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setMinPrice("");
    setMaxPrice("");
    setStatus("");
    setSortField("");
    setSortDirection("asc");
    setFilteredSales(indirectsales);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page, two pages before and after when possible
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(17, 48, 81);
    doc.text("Indirect Sales Report", 105, 15, null, null, "center");

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
      doc.text(`Invoice ID: ${sale.invoiceId}`, 20, yOffset + 7);
      doc.text(`Buyer ID: ${sale.buyerId}`, 20, yOffset + 14);
      doc.text(
        `Date: ${new Date(sale.date).toLocaleString()}`,
        20,
        yOffset + 21
      );
      doc.text(`Total Amount: ${sale.totalAmount}`, 20, yOffset + 28);

      yOffset += 50;
    });

    doc.save("Indirect_Sales_Report.pdf");
  };

  return (
    <div>
      <SalesNav />
      <HeadBar />
      <div className="indirectsales-sales-container">
        <div className="indirectsales-header">
          <h2 className="indirectsales-sales-title">Indirect Sales Records</h2>
          <Link to="/spissueitems" className="indirectsales-add-sale-btn">
            Add Sale
          </Link>
        </div>

        {/* Advanced Filters Section */}
        <div className="indirectsales-advanced-filters">
          <div className="indirectsales-search-container">
            <input
              type="search"
              placeholder="Search by invoice ID, buyer, amount..."
              className="indirectsales-search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="indirectsales-filter-container">
            <div className="indirectsales-filter-group">
              <label>Date Range</label>
              <div className="indirectsales-date-inputs">
                <input
                  type="date"
                  className="indirectsales-date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="From"
                />
                <span>to</span>
                <input
                  type="date"
                  className="indirectsales-date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="To"
                />
              </div>
            </div>

            <div className="indirectsales-filter-group">
              <label>Price Range</label>
              <div className="indirectsales-price-inputs">
                <input
                  type="number"
                  className="indirectsales-price-input"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="number"
                  className="indirectsales-price-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="indirectsales-filter-group">
              <label>Status</label>
              <select
                className="indirectsales-filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="indirectsales-filter-group">
              <label>Sort By</label>
              <select
                className="indirectsales-filter-select"
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split("-");
                  setSortField(field);
                  setSortDirection(direction);
                }}
              >
                <option value="">Default</option>
                <option value="date-desc">Date Newest first</option>
                <option value="date-asc">Date Oldest first</option>
                <option value="totalAmount-asc">Price low to high</option>
                <option value="totalAmount-desc">Price high to low</option>
              </select>
            </div>

            <button className="indirectsales-reset-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="indirectsales-results-summary">
          <div>
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredSales.length)} of{" "}
            {filteredSales.length} results
          </div>
          <div className="indirectsales-items-per-page">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="indirectsales-table-container">
          <table className="indirectsales-sales-table">
            <thead>
              <tr>
                <th
                  className="indirectsales-sortable-header"
                  onClick={() => handleSort("invoiceId")}
                >
                  Invoice ID
                  {sortField === "invoiceId" && (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
                <th
                  className="indirectsales-sortable-header"
                  onClick={() => handleSort("buyerId")}
                >
                  Buyer ID
                  {sortField === "buyerId" && (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
                <th
                  className="indirectsales-sortable-header"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortField === "date" && (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
                <th
                  className="indirectsales-sortable-header"
                  onClick={() => handleSort("totalAmount")}
                >
                  Total Amount
                  {sortField === "totalAmount" && (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="indirectsales-no-results">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((sale) => (
                  <tr
                    key={sale.invoiceId}
                    className={
                      hoveredRow === sale.invoiceId
                        ? "indirectsales-hovered-row"
                        : ""
                    }
                    onMouseEnter={() => setHoveredRow(sale.invoiceId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td>{sale.invoiceId}</td>
                    <td>{sale.buyerId}</td>
                    <td>{new Date(sale.date).toLocaleString()}</td>
                    <td className="indirectsales-amount-cell">
                      ${sale.totalAmount.toFixed(2)}
                    </td>
                    <td>
                      <button
                        onClick={() => viewDetails(sale.invoiceId)}
                        className="indirectsales-view-btn"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="indirectsales-no-results">
                    No sales found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredSales.length > 0 && (
          <div className="indirectsales-pagination-controls">
            <button
              className="indirectsales-pagination-btn"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="indirectsales-page-numbers">
              {getPageNumbers().map((number, index) =>
                number === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="indirectsales-ellipsis"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={number}
                    className={`indirectsales-page-number ${
                      currentPage === number ? "indirectsales-active" : ""
                    }`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                )
              )}
            </div>

            <button
              className="indirectsales-pagination-btn"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {/* Report Buttons */}
        <div className="indirectsales-report-controls">
          <div className="indirectsales-report-btn-container">
            <button onClick={generatePDF} className="indirectsales-report-btn">
              Download PDF Report
            </button>
          </div>
        </div>

        {/* Modal for viewing sale details */}
        {showModal && selectedSale && (
          <div className="indirectsales-modal">
            <div className="indirectsales-modal-content">
              <div className="indirectsales-modal-header">
                <h3>Sale Details</h3>
                <button
                  className="indirectsales-close-modal"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="indirectsales-invoice-details">
                <div className="indirectsales-invoice-header">
                  <div className="indirectsales-invoice-info">
                    <p>
                      <strong>Invoice ID:</strong> {selectedSale.invoiceId}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(selectedSale.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {selectedSale.status || "Completed"}
                    </p>
                  </div>

                  <div className="indirectsales-buyer-info">
                    <p>
                      <strong>Buyer ID:</strong> {selectedSale.buyerId}
                    </p>
                    {selectedSale.buyerName && (
                      <p>
                        <strong>Buyer Name:</strong> {selectedSale.buyerName}
                      </p>
                    )}
                    {selectedSale.buyerContact && (
                      <p>
                        <strong>Contact:</strong> {selectedSale.buyerContact}
                      </p>
                    )}
                  </div>
                </div>

                <h4>Items</h4>
                <table className="indirectsales-items-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items &&
                      selectedSale.items.map((item, index) => (
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
                      <td colSpan="3" className="indirectsales-total-label">
                        Total Amount:
                      </td>
                      <td className="indirectsales-total-amount">
                        ${selectedSale.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="indirectsales-modal-actions">
                  <button
                    className="indirectsales-modal-btn indirectsales-cancel-btn"
                    onClick={() => setShowModal(false)}
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

export default IndirectBuyerSales;
