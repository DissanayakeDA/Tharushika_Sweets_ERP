import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sales.css"; // Add styling if needed
import Nav from "../Nav/Nav";

function Sales() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sales")
      .then((response) => {
        if (response.data.success) {
          setSales(response.data.sales);
        }
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
      });
  }, []);

  const viewDetails = (invoiceId) => {
    axios
      .get(`http://localhost:5000/api/sales/${invoiceId}`)
      .then((response) => {
        if (response.data.success) {
          setSelectedSale(response.data.sale);
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching sale details:", error);
      });
  };

  return (
  <div>
    <Nav/>
    <div className="sales-container">
    <div className="header">
      <h2 className="sales-title">Sales Records</h2>
      <hr className="hr-sales" />
      </div>

      <div className="table-container">
          
      <table className="sales-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>BuyerID</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.invoiceId}>
              <td>{sale.invoiceId}</td>
              <td>{sale.buyerId}</td>
              <td>{new Date(sale.date).toLocaleString()}</td>
              <td>${sale.totalAmount.toFixed(2)}</td>
              <td>
                <button onClick={() => viewDetails(sale.invoiceId)} className="view-btn">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
      {showModal && selectedSale && (
        <div className="modal">
          <div className="modal-content">
            <h3>Invoice Details</h3>
            <p><strong>Invoice ID:</strong> {selectedSale.invoiceId}</p>
            <p><strong>Date:</strong> {new Date(selectedSale.date).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ${selectedSale.totalAmount.toFixed(2)}</p>

            <h4>Items</h4>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items.map((item, index) => (
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

export default Sales;
