import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewReturns.css"; // Added styling
import Nav from "../Nav/Nav";

function ViewReturns() {
  const [returns, setReturns] = useState([]); // Renamed to 'returns'
  const [selectedReturn, setSelectedReturn] = useState(null); // Renamed to 'selectedReturn'
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch returns data from the backend
    axios
      .get("http://localhost:5000/api/returns") // Changed from 'sales' to 'returns'
      .then((response) => {
        if (response.data.success) {
          setReturns(response.data.returns); // Renamed to 'returns'
        }
      })
      .catch((error) => {
        console.error("Error fetching returns:", error); // Changed error message to 'returns'
      });
  }, []);

  const returnsviewDetails = async (returnId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/returns/${returnId}`);
      if (response.data.success) {
        setSelectedReturn(response.data.returnRecord); // Ensure this matches the backend response
        setShowModal(true); // Show the modal
      } else {
        console.error("Error fetching return details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching return details:", error);
    }
  };
  

  return (
    <div>
      <Nav />
      <div className="returns-container">
        <div className="header">
          <h2 className="returns-title">Returns Records</h2> {/* Changed title */}
          <hr className="hr-returns" />
        </div>

        <div className="table-container">
          <table className="returns-table">
            <thead>
              <tr>
                <th>ReturnID</th> {/* Changed 'Invoice ID' to 'Return ID' */}
                <th>BuyerID</th>
                <th>Date</th>
                <th>TotalAmount</th>
                <th>ReturnMethod</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {returns.map((returnData) => (
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

export default ViewReturns;
