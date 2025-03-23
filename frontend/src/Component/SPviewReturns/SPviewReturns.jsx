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

  useEffect(() => {
    // Fetch returns data from backend
    axios
      .get("http://localhost:5000/api/indirectreturns")
      .then((response) => {
        if (response.data.success) {
          setReturns(response.data.returns);
          setFilteredReturns(response.data.returns); 
        }
      })
      .catch((error) => {
        console.error("Error fetching returns:", error);
      });
  }, []);

  const returnsviewDetails = async (returnId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/indirectreturns/${returnId}`);
      if (response.data.success) {
        setSelectedReturn(response.data.returnRecord);
        setShowModal(true);
      } else {
        console.error("Error fetching return details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching return details:", error);
    }
  };

  //  Search Function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = returns.filter((retur) =>
      Object.keys(retur).some((key) => {
        let fieldValue = retur[key];

        if (key === "date") {
          fieldValue = new Date(fieldValue).toLocaleString();
        } else if (key === "totalAmount" || key === "issueMoney" || key === "issueProduct") {
          fieldValue = fieldValue.toString();
        } else if (key === "returnMethod") {
          fieldValue = fieldValue.toLowerCase(); 
        }

        return fieldValue.toLowerCase().includes(query);
      })
    );

    setFilteredReturns(filtered);
  };

  // Filter Function
  const handleFilter = (e) => {
    const option = e.target.value;
    setFilterOption(option);

    let sortedReturns = [...filteredReturns];

    if (option === "date-newest") {
      sortedReturns.sort((a, b) => new Date(b.date) - new Date(a.date)); 
    } else if (option === "date-oldest") {
      sortedReturns.sort((a, b) => new Date(a.date) - new Date(b.date)); 
    } else if (option === "price-low-high") {
      sortedReturns.sort((a, b) => a.totalAmount - b.totalAmount); 
    } else if (option === "price-high-low") {
      sortedReturns.sort((a, b) => b.totalAmount - a.totalAmount); 
    
    }

    setFilteredReturns(sortedReturns);
  };

  const generatePDF = () => {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.setTextColor(17, 48, 81);
      doc.text("Direct Returns Report", 105, 15, null, null, "center");
    
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
        doc.text(`Sales ID: ${sale._id}`, 20, yOffset + 7);
        doc.text(`ReturnInvoice ID: ${sale.returnId}`, 20, yOffset + 14);
        doc.text(`Buyer ID: ${sale.buyerId}`, 20, yOffset + 21);
        doc.text(`Date: ${sale.date}`, 20, yOffset + 28);
        doc.text(`Total Amount: ${sale.totalAmount}`, 20, yOffset + 35);
        doc.text(`Return Method: ${sale.returnMethod}`, 20, yOffset + 42);
    
        yOffset += 50; 
      });
    
      doc.save("Direct_Returns_Report.pdf");
    };

  return (
    <div>
      <SPNav />
      <HeadBar/>
      <div className="returns-container">
        <div className="header">
          <h2 className="returns-title">Returns Records</h2>
        </div>

        <div className="table-controls">
          <input
            type="search"
            placeholder="Search Here"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />

          <select className="filter-select" value={filterOption} onChange={handleFilter}>
            <option value="default">Filter By</option>
            <option value="date-newest">Date: Newest First</option>
            <option value="date-oldest">Date: Oldest First</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>

        <div className="table-container">
          <table className="returns-table">
            <thead>
              <tr>
                <th>ReturnID</th>
                <th>BuyerID</th>
                <th>Date</th>
                <th>TotalAmount</th>
                <th>ReturnMethod</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((returnData) => (
                <tr key={returnData.returnId}>
                  <td>{returnData.returnId}</td>
                  <td>{returnData.buyerId}</td>
                  <td>{new Date(returnData.date).toLocaleString()}</td>
                  <td>${returnData.totalAmount.toFixed(2)}</td>
                  <td>{returnData.returnMethod}</td>
                  <td>
                    <button onClick={() => returnsviewDetails(returnData.returnId)} className="returnsview-btn">
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

        {showModal && selectedReturn && (
          <div className="returnsmodal show">
            <div className="returnsmodal-content">
              <h3>Return Details</h3>
              <p><strong>Return ID:</strong> {selectedReturn.returnId}</p>
              <p><strong>Date:</strong> {new Date(selectedReturn.date).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> ${selectedReturn.totalAmount.toFixed(2)}</p>

              <h4>Items</h4>
              <table className="returnsitems-table">
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

export default SPViewReturns;
