import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import Buyer from "../Buyer/Buyer";
import "../Buyer/Buyer.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import HeadBar from "../HeadBar/HeadBar";

const URL = "http://localhost:5000/buyers";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Buyers() {
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchHandler().then((data) => {
      setBuyers(data.buyers);
      setFilteredBuyers(data.buyers);
    });
  }, []);

  const handleDelete = (id) => {
    setBuyers((prevBuyers) => prevBuyers.filter((buyer) => buyer._id !== id));
    setFilteredBuyers((prevBuyers) =>
      prevBuyers.filter((buyer) => buyer._id !== id)
    );
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFiltersAndSort(query, nameFilter);
  };

  const handleNameFilter = (e) => {
    const filter = e.target.value.toLowerCase();
    setNameFilter(filter);
    applyFiltersAndSort(searchQuery, filter);
  };

  const applyFiltersAndSort = (search, name) => {
    let result = [...buyers];

    if (search) {
      result = result.filter((buyer) =>
        Object.values(buyer).some((field) =>
          field.toString().toLowerCase().includes(search)
        )
      );
    }

    if (name) {
      result = result.filter((buyer) =>
        buyer.name.toLowerCase().includes(name)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredBuyers(result);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    applyFiltersAndSort(searchQuery, nameFilter);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBuyers = filteredBuyers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBuyers.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(17, 48, 81);
    doc.text("Direct Buyers Report", 105, 15, null, null, "center");

    currentBuyers.forEach((buyer, i) => {
      const yOffset = 25 + i * 40;
      doc.setFontSize(12);
      doc.setTextColor(17, 48, 81);
      doc.text(`Buyer ${i + 1}`, 15, yOffset);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`ID: ${buyer._id}`, 20, yOffset + 7);
      doc.text(`Name: ${buyer.name}`, 20, yOffset + 14);
      doc.text(`Address: ${buyer.address}`, 20, yOffset + 21);
    });

    doc.save("Direct_Buyers_Report.pdf");
  };

  return (
    <div>
      <Nav />
      <HeadBar />
      <div className="viewDB-buyers-container">
        <div className="viewDB-header">
          <h2 className="viewDB-buyer-title">Buyers' List</h2>
          <Link to="/addbuyers">
            <button className="viewDB-new-buyer-btn">+ New Buyer</button>
          </Link>
        </div>

        <div className="viewDB-advanced-filters">
          <input
            type="search"
            placeholder="Search Here"
            className="viewDB-search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="viewDB-results-summary">
          <span>
            Showing {currentBuyers.length} of {filteredBuyers.length} buyers
          </span>
          <div className="viewDB-items-per-page">
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

        <div className="viewDB-table-container">
          <table className="viewDB-buyers-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("_id")}>
                  Buyer ID {getSortIndicator("_id")}
                </th>
                <th onClick={() => handleSort("name")}>
                  Buyer Name {getSortIndicator("name")}
                </th>
                <th onClick={() => handleSort("address")}>
                  Address {getSortIndicator("address")}
                </th>
                <th onClick={() => handleSort("contact")}>
                  Contact {getSortIndicator("contact")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email {getSortIndicator("email")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentBuyers.length > 0 ? (
                currentBuyers.map((buyer, i) => (
                  <Buyer key={i} buyer={buyer} onDelete={handleDelete} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="viewDB-pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="viewDB-pagedetails">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <div className="viewDB-report-btn-container">
          <button onClick={generatePDF} className="viewDB-report-btn">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default Buyers;
