import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import Buyer from "../Buyer/Buyer";
import "../Buyer/Buyer.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf"; 

const URL = "http://localhost:5000/buyers";

// Fetch data from the API
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Buyers() {
  const [buyers, setBuyers] = useState([]); 
  const [filteredBuyers, setFilteredBuyers] = useState([]); 

 
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

  // Search function
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

    doc.setFontSize(16);
    doc.setTextColor(17, 48, 81); 
    doc.text("Direct Buyers Report", 105, 15, null, null, "center");

    filteredBuyers.forEach((buyer, i) => {
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
      <div className="buyers-container">
        <div className="header">
          <h2 className="buyer-title">Buyers' List</h2>
          <hr className="hr-buyer" />
          <Link to="/addbuyers">
            <button className="new-buyer-btn">+ New Buyer</button>
          </Link>
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

         
          <table className="buyers-table">
            <thead>
              <tr>
                
                <th>Buyer ID</th>
                <th>Buyer Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Action</th>
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

export default Buyers;
