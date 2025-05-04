import React, { useState, useEffect } from "react";
import GMNav from "../GMNav/GMNav";
import axios from "axios";
import Supplier from "./Supplier.jsx";
import "./Supplier.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import HeadBar from "../HeadBar/HeadBar.jsx";

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

  useEffect(() => {
    fetchHandler().then((data) => {
      // Check if the response has success: true and data is an array
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = suppliers.filter((supplier) =>
      Object.values(supplier).some((field) =>
        field?.toString().toLowerCase().includes(query)
      )
    );
    setFilteredSuppliers(filtered);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.text("Supplier Report", 105, 15, null, null, "center");

    filteredSuppliers.forEach((supplier, i) => {
      const yOffset = 25 + i * 40;
      doc.setFontSize(12);
      doc.setTextColor(0, 153, 76);
      doc.text(`Supplier ${i + 1}`, 15, yOffset);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`ID: ${supplier._id}`, 20, yOffset + 7);
      doc.text(`Name: ${supplier.supplier_name}`, 20, yOffset + 14);
      doc.text(`Contact: ${supplier.supplier_phone}`, 20, yOffset + 21);
    });

    doc.save("Suppliers_Report.pdf");
  };

  return (
    <div>
      <GMNav />
      <HeadBar />
      <div className="buyers-container">
        <div className="header">
          <h2 className="buyer-title">Supplier List</h2>
        </div>

        <div className="table-container">
          <div className="table-controls">
            <input
              type="search"
              placeholder="Search Here"
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <table className="supplier-table">
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Supplier Name</th>
                <th>Supplier Address</th>
                <th>Supplier Phone</th>
                <th>Supplier Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers && filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier, i) => (
                  <Supplier key={i} supplier={supplier} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="report-btn-container">
            <button onClick={generatePDF} className="report-btn">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Suppliers;
