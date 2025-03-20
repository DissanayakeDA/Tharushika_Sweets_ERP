import React, { useState, useEffect } from "react";
import GMNav from "../GMNav/GMNav";
import axios from "axios";
import Buyer from "./GMBuyer";
import "./GMBuyer.css";
import HeadBar from "../HeadBar/HeadBar";

import jsPDF from "jspdf"; // Import jsPDF

const URL = "http://localhost:5000/buyers";

// Fetch data from the API
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function GMBuyers() {
  const [buyers, setBuyers] = useState([]); // State for all buyers
  const [filteredBuyers, setFilteredBuyers] = useState([]); // State for filtered buyers

  // Fetch the list of buyers on component mount
  useEffect(() => {
    fetchHandler().then((data) => {
      setBuyers(data.buyers);
      setFilteredBuyers(data.buyers); // Initially, display all buyers
    });
  }, []);

  // Handle deleting a buyer and updating the state
  const handleDelete = (id) => {
    setBuyers((prevBuyers) => prevBuyers.filter((buyer) => buyer._id !== id));
    setFilteredBuyers((prevBuyers) =>
      prevBuyers.filter((buyer) => buyer._id !== id)
    );
  };

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = buyers.filter((buyer) =>
      Object.values(buyer).some((field) =>
        field.toString().toLowerCase().includes(query)
      )
    );

    setFilteredBuyers(filtered);
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set title styling
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204); // Blue color for the title
    doc.text("Direct Buyers Report", 105, 15, null, null, "center");

    // Loop through users and format content
    filteredBuyers.forEach((buyer, i) => {
      const yOffset = 25 + i * 40; // Increased spacing for better readability

      // Section header
      doc.setFontSize(12);
      doc.setTextColor(0, 153, 76); // Green color for headers
      doc.text(`Buyer ${i + 1}`, 15, yOffset);

      // User details
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); // Black color for regular text
      doc.text(`ID: ${buyer._id}`, 20, yOffset + 7);
      doc.text(`Name: ${buyer.name}`, 20, yOffset + 14);
      doc.text(`Contact: ${buyer.contact}`, 20, yOffset + 21);
    });

    doc.save("Direct_Buyers_Report.pdf");
  };

  return (
    <div>
      <GMNav />
      <HeadBar />
      <div className="buyers-container">
        <div className="header">
          <h2 className="buyer-title">Buyers' List</h2>
        </div>

        <div className="table-container">
          <div className="table-controls">
            {/* Search Input */}
            <input
              type="search"
              placeholder="Search Here"
              className="search-input"
              value={searchQuery}
              onChange={handleSearch} // Add onChange event
            />
          </div>

          {/* Buyers Table */}
          <table className="buyers-table">
            <thead>
              <tr>
                <th>Buyer ID</th>
                <th>Buyer Name</th>
                <th>Address</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuyers && filteredBuyers.length > 0 ? (
                filteredBuyers.map((buyer, i) => (
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

          {/* Download Report Button */}
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

export default GMBuyers;
