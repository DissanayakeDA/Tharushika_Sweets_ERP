import React, { useState, useEffect } from "react";
import GMNav from "../GMNav/GMNav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import Supplier from "../Supplier/Supplier.jsx";
import "../Supplier/Supplier.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const URL = "http://localhost:5000/api/suppliers";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return { success: false, data: [] };
  }
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchHandler().then((data) => {
      if (data && data.success && Array.isArray(data.data)) {
        setSuppliers(data.data);
        setFilteredSuppliers(data.data);
      } else {
        console.error("Unexpected API response format:", data);
        setSuppliers([]);
        setFilteredSuppliers([]);
      }
    });
  }, []);

  const handleDelete = (id) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.filter((supplier) => supplier._id !== id)
    );
    setFilteredSuppliers((prevSuppliers) =>
      prevSuppliers.filter((supplier) => supplier._id !== id)
    );
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = suppliers.filter((supplier) =>
      Object.values(supplier).some((field) =>
        field?.toString().toLowerCase().includes(query)
      )
    );
    setFilteredSuppliers(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(17, 48, 81);
    doc.text("Suppliers Report", 105, 15, null, null, "center");

    currentSuppliers.forEach((supplier, i) => {
      const yOffset = 25 + i * 40;
      doc.setFontSize(12);
      doc.setTextColor(17, 48, 81);
      doc.text(`Supplier ${i + 1}`, 15, yOffset);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`ID: ${supplier._id}`, 20, yOffset + 7);
      doc.text(`Name: ${supplier.supplier_name}`, 20, yOffset + 14);
      doc.text(`Address: ${supplier.supplier_address}`, 20, yOffset + 21);
    });

    doc.save("Suppliers_Report.pdf");
  };

  return (
    <div>
      <GMNav />
      <HeadBar />
      <div className="viewDB-buyers-container">
        <div className="viewDB-header">
          <h2 className="viewDB-buyer-title">Suppliers List</h2>
          <Link to="/addsuppliers">
            <button className="viewDB-new-buyer-btn">+ New Supplier</button>
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
            Showing {currentSuppliers.length} of {filteredSuppliers.length}{" "}
            suppliers
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
                <th>Supplier ID</th>
                <th>Supplier Name</th>
                <th>Supplier Address</th>
                <th>Supplier Phone</th>
                <th>Supplier Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSuppliers && currentSuppliers.length > 0 ? (
                currentSuppliers.map((supplier, i) => (
                  <Supplier
                    key={i}
                    supplier={supplier}
                    onDelete={handleDelete}
                  />
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

export default Suppliers;
