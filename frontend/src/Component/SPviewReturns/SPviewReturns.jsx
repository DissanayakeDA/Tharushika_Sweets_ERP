import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SPviewReturns.css";
import SPNav from "../SalesNav/SalesNav";
import jsPDF from "jspdf";
import HeadBar from "../HeadBar/HeadBar";

function SPViewReturns() {
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("default");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [hoveredRowId, setHoveredRowId] = useState(null);

  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Price filter state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    // Fetch returns data from backend
    axios
      .get("http://localhost:5000/api/indirectreturns")
      .then((response) => {
        console.log("Response from backend:", response.data);
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setReturns(response.data);
          setFilteredReturns(response.data);
        } else if (response.data.returns) {
          setReturns(response.data.returns);
          setFilteredReturns(response.data.returns);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching returns:", error);
      });
  }, []);

  const returnsviewDetails = async (returnId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/indirectreturns/${returnId}`
      );
      console.log("Return details response:", response.data);
      if (response.data.success) {
        setSelectedReturn(response.data.returnRecord);
      } else if (response.data) {
        setSelectedReturn(response.data);
      }
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching return details:", error);
    }
  };

  // Search Function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, startDate, endDate, minPrice, maxPrice, filterOption);
  };

  // Filter Function
  const handleFilter = (e) => {
    const option = e.target.value;
    setFilterOption(option);
    applyFilters(searchQuery, startDate, endDate, minPrice, maxPrice, option);
  };

  // Handle date and price filter changes
  const handleDateChange = (type, value) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    applyFilters(
      searchQuery,
      type === "start" ? value : startDate,
      type === "end" ? value : endDate,
      minPrice,
      maxPrice,
      filterOption
    );
  };

  const handlePriceChange = (type, value) => {
    if (type === "min") {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
    applyFilters(
      searchQuery,
      startDate,
      endDate,
      type === "min" ? value : minPrice,
      type === "max" ? value : maxPrice,
      filterOption
    );
  };

  // Apply all filters
  const applyFilters = (query, start, end, min, max, option) => {
    let filtered = returns;

    // Search filter
    if (query) {
      filtered = filtered.filter((retur) =>
        Object.keys(retur).some((key) => {
          let fieldValue = retur[key];

          if (key === "date") {
            fieldValue = new Date(fieldValue).toLocaleString();
          } else if (
            key === "totalAmount" ||
            key === "issueMoney" ||
            key === "issueProduct"
          ) {
            fieldValue = fieldValue.toString();
          } else if (key === "returnMethod") {
            fieldValue = fieldValue.toLowerCase();
          }

          return String(fieldValue).toLowerCase().includes(query);
        })
      );
    }

    // Date range filter
    if (start) {
      const startDateObj = new Date(start);
      filtered = filtered.filter((item) => new Date(item.date) >= startDateObj);
    }
    if (end) {
      const endDateObj = new Date(end);
      endDateObj.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((item) => new Date(item.date) <= endDateObj);
    }

    // Price range filter
    if (min) {
      filtered = filtered.filter((item) => item.totalAmount >= parseFloat(min));
    }
    if (max) {
      filtered = filtered.filter((item) => item.totalAmount <= parseFloat(max));
    }

    // Sort options
    if (option === "date-newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (option === "date-oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (option === "price-low-high") {
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    } else if (option === "price-high-low") {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    setFilteredReturns(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setMinPrice("");
    setMaxPrice("");
    setFilterOption("default");
    setFilteredReturns(returns);
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReturns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(17, 48, 81);
    doc.text("Indirect Returns Report", 105, 15, null, null, "center");

    let yOffset = 25;

    filteredReturns.forEach((sale, i) => {
      if (yOffset > 260) {
        doc.addPage();
        yOffset = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(17, 48, 81);
      doc.text(`Return ${i + 1}`, 15, yOffset);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Return ID: ${sale.returnId || sale.indirectreturnId}`,
        20,
        yOffset + 7
      );
      doc.text(`Buyer ID: ${sale.buyerId}`, 20, yOffset + 14);
      doc.text(
        `Date: ${new Date(sale.date).toLocaleString()}`,
        20,
        yOffset + 21
      );
      doc.text(`Total Amount: ${sale.totalAmount}`, 20, yOffset + 28);
      doc.text(`Return Method: ${sale.returnMethod}`, 20, yOffset + 35);

      yOffset += 50;
    });

    doc.save("Indirect_Returns_Report.pdf");
  };

  return (
    <div>
      <SPNav />
      <HeadBar />
      <div className="spviewreturns-sales-container">
        <div className="spviewreturns-header">
          <h2 className="spviewreturns-sales-title">Returns Records</h2>
        </div>

        {/* Advanced filters section */}
        <div className="spviewreturns-advanced-filters">
          <div className="spviewreturns-search-container">
            <input
              type="search"
              placeholder="Search returns by any field..."
              className="spviewreturns-search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="spviewreturns-filter-container">
            <div className="spviewreturns-filter-group">
              <label>Date Range</label>
              <div className="spviewreturns-date-inputs">
                <input
                  type="date"
                  className="spviewreturns-date-input"
                  value={startDate}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  placeholder="From"
                />
                <span>to</span>
                <input
                  type="date"
                  className="spviewreturns-date-input"
                  value={endDate}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  placeholder="To"
                />
              </div>
            </div>

            <div className="spviewreturns-filter-group">
              <label>Amount Range</label>
              <div className="spviewreturns-price-inputs">
                <input
                  type="number"
                  className="spviewreturns-price-input"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  className="spviewreturns-price-input"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                />
              </div>
            </div>

            <div className="spviewreturns-filter-group">
              <label>Sort By</label>
              <select
                className="spviewreturns-filter-select"
                value={filterOption}
                onChange={handleFilter}
              >
                <option value="default">Default</option>
                <option value="date-newest">Date: Newest First</option>
                <option value="date-oldest">Date: Oldest First</option>
                <option value="price-low-high">Amount: Low to High</option>
                <option value="price-high-low">Amount: High to Low</option>
              </select>
            </div>

            <button onClick={resetFilters} className="spviewreturns-reset-btn">
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results summary section */}
        <div className="spviewreturns-results-summary">
          <span>Showing {filteredReturns.length} returns</span>
          <div className="spviewreturns-items-per-page">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table container */}
        <div className="spviewreturns-table-container">
          <table className="spviewreturns-sales-table">
            <thead>
              <tr>
                <th className="spviewreturns-sortable-header">Return ID</th>
                <th className="spviewreturns-sortable-header">Buyer ID</th>
                <th className="spviewreturns-sortable-header">Date</th>
                <th className="spviewreturns-sortable-header">Total Amount</th>
                <th className="spviewreturns-sortable-header">Return Method</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((returnData) => (
                  <tr
                    key={returnData.returnId || returnData.indirectreturnId}
                    className={
                      hoveredRowId ===
                      (returnData.returnId || returnData.indirectreturnId)
                        ? "spviewreturns-hovered-row"
                        : ""
                    }
                    onMouseEnter={() =>
                      setHoveredRowId(
                        returnData.returnId || returnData.indirectreturnId
                      )
                    }
                    onMouseLeave={() => setHoveredRowId(null)}
                  >
                    <td>
                      {returnData.returnId || returnData.indirectreturnId}
                    </td>
                    <td>{returnData.buyerId}</td>
                    <td>{new Date(returnData.date).toLocaleString()}</td>
                    <td className="spviewreturns-amount-cell">
                      ${returnData.totalAmount.toFixed(2)}
                    </td>
                    <td>{returnData.returnMethod}</td>
                    <td>
                      <button
                        onClick={() =>
                          returnsviewDetails(
                            returnData.returnId || returnData.indirectreturnId
                          )
                        }
                        className="spviewreturns-view-btn"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="spviewreturns-no-results">
                    No returns found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {filteredReturns.length > 0 && (
          <div className="spviewreturns-pagination-controls">
            <button
              className="spviewreturns-pagination-btn"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="spviewreturns-pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="spviewreturns-page-numbers">
              {/* Logic for page number display */}
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }
                return (
                  <button
                    key={idx}
                    className={`spviewreturns-page-number ${
                      currentPage === pageNum ? "spviewreturns-active" : ""
                    }`}
                    onClick={() => paginate(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="spviewreturns-pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="spviewreturns-pagination-btn"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        )}

        {/* Report controls */}
        <div className="spviewreturns-report-controls">
          <div className="spviewreturns-report-btn-container">
            <button onClick={generatePDF} className="spviewreturns-report-btn">
              Download PDF Report
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedReturn && (
          <div className="spviewreturns-modal">
            <div className="spviewreturns-modal-content">
              <div className="spviewreturns-modal-header">
                <h3>Return Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="spviewreturns-close-modal"
                >
                  ×
                </button>
              </div>

              <div className="spviewreturns-invoice-details">
                <div className="spviewreturns-invoice-header">
                  <div className="spviewreturns-invoice-info">
                    <p>
                      <strong>Return ID:</strong>{" "}
                      {selectedReturn.returnId ||
                        selectedReturn.indirectreturnId}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(selectedReturn.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> $
                      {selectedReturn.totalAmount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Return Method:</strong>{" "}
                      {selectedReturn.returnMethod}
                    </p>
                  </div>

                  <div className="spviewreturns-buyer-info">
                    <p>
                      <strong>Buyer ID:</strong> {selectedReturn.buyerId}
                    </p>
                    {selectedReturn.buyerName && (
                      <p>
                        <strong>Buyer Name:</strong> {selectedReturn.buyerName}
                      </p>
                    )}
                    {selectedReturn.buyerEmail && (
                      <p>
                        <strong>Buyer Email:</strong>{" "}
                        {selectedReturn.buyerEmail}
                      </p>
                    )}
                    {selectedReturn.buyerPhone && (
                      <p>
                        <strong>Buyer Phone:</strong>{" "}
                        {selectedReturn.buyerPhone}
                      </p>
                    )}
                  </div>
                </div>

                <h4>Returned Items</h4>
                <table className="spviewreturns-items-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReturn.items.map((item, index) => (
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
                      <td colSpan="3" className="spviewreturns-total-label">
                        Total Amount:
                      </td>
                      <td className="spviewreturns-total-amount">
                        ${selectedReturn.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="spviewreturns-modal-actions">
                  <button
                    onClick={() => setShowModal(false)}
                    className="spviewreturns-modal-btn spviewreturns-cancel-btn"
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

export default SPViewReturns;
