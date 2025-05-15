import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyStockChangeRequest.css";

function MyStockChangeRequests() {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [hoveredRow, setHoveredRow] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Fetch user's stock change requests
  const fetchUserRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/stock-change-requests/my-requests?created_by=${user.username}`
      );
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stock change requests:", error);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [navigate, user]);

  // Delete a request
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/stock-change-requests/${id}`
        );
        if (response.data.success) {
          setRequests(requests.filter((req) => req._id !== id));
          alert("Request deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        alert(
          `Failed to delete request: ${
            error.response ? error.response.data.message : error.message
          }`
        );
      }
    }
  };

  // Sort function
  const handleSort = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Filter and sort requests
  const filteredRequests = requests.filter(
    (request) =>
      request.stock_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      const valueA = a[sortField] ? a[sortField].toString().toLowerCase() : "";
      const valueB = b[sortField] ? b[sortField].toString().toLowerCase() : "";

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSortField("createdAt");
    setSortDirection("desc");
    setCurrentPage(1);
  };

  return (
    <>
      <Nav />
      <HeadBar />
      <div className="dbIssue-sales-container">
        <div className="dbIssue-header">
          <h2 className="dbIssue-sales-title">My Stock Change Requests</h2>
        </div>

        {/* Advanced filters section */}
        <div className="dbIssue-advanced-filters">
          <div className="dbIssue-search-container">
            <input
              type="text"
              className="dbIssue-search-input"
              placeholder="Search by stock ID, request type, reason or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="dbIssue-filter-container">
            <div className="dbIssue-filter-group">
              <button
                className="dbIssue-reset-btn"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="dbIssue-results-summary">
          <span>
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, sortedRequests.length)} of{" "}
            {sortedRequests.length} requests
          </span>
          <div className="dbIssue-items-per-page">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table container */}
        <div className="dbIssue-table-container">
          <table className="dbIssue-sales-table">
            <thead>
              <tr>
                <th
                  className="dbIssue-sortable-header"
                  onClick={() => handleSort("stock_id")}
                >
                  Stock ID{" "}
                  {sortField === "stock_id" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="dbIssue-sortable-header"
                  onClick={() => handleSort("request_type")}
                >
                  Request Type{" "}
                  {sortField === "request_type" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Reason</th>
                <th
                  className="dbIssue-sortable-header"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortField === "status" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="dbIssue-sortable-header"
                  onClick={() => handleSort("createdAt")}
                >
                  Created At{" "}
                  {sortField === "createdAt" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((request) => (
                  <tr
                    key={request._id}
                    onMouseEnter={() => setHoveredRow(request._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={
                      hoveredRow === request._id ? "dbIssue-hovered-row" : ""
                    }
                  >
                    <td>{request.stock_id}</td>
                    <td>{request.request_type}</td>
                    <td>{request.reason}</td>
                    <td>{request.status}</td>
                    <td>{new Date(request.createdAt).toLocaleString()}</td>
                    <td>
                      {request.status === "Pending" && (
                        <button
                          className="dbIssue-view-btn"
                          onClick={() => handleDelete(request._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="dbIssue-no-results">
                    No requests found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {sortedRequests.length > 0 && (
          <div className="dbIssue-pagination-controls">
            <button
              className="dbIssue-pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="dbIssue-pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="dbIssue-page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`dbIssue-page-number ${
                      currentPage === pageNum ? "dbIssue-active" : ""
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="dbIssue-pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="dbIssue-pagination-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default MyStockChangeRequests;
