import React from "react";
import SalesNav from "../SalesNav/SalesNav";
import "./ViewSalesStock.css";
import HeadBar from "../HeadBar/HeadBar";

function ViewSalesStock() {
  // Static placeholder data (replace with your actual data if needed)
  const stockItems = [
    { _id: "1", product_name: "Product A", product_quantity: 10, product_price: 25.99 },
    { _id: "2", product_name: "Product B", product_quantity: 5, product_price: 15.50 },
    { _id: "3", product_name: "Product C", product_quantity: 20, product_price: 10.00 },
  ];

  return (
    <div>
      <SalesNav />
      <HeadBar />
      <div className="view-stock-container">
        <div className="header">
          <h2 className="view-stock-title">View Stock</h2>
        </div>
        <div className="table-container">
          <table className="view-stock-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.product_name}</td>
                  <td>{item.product_quantity}</td>
                  <td>${item.product_price.toFixed(2)}</td>
                  <td>
                    <div className="action-icons">
                      <button className="action">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="action">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewSalesStock;