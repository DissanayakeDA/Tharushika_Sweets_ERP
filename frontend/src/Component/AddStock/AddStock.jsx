import React from "react";
import Nav from "../Nav/Nav";
import "./AddStock.css";

function AddStock() {
  return (
    <div className="issue-items-container">
      <Nav />
      <h2 className="title">Add Stock</h2>
      <hr className="hr-issue" />
      <table className="issue-items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select></select>
            </td>

            <td>1500</td>

            <td className="qty-input">
              <input type="number" />
            </td>

            <td>total</td>

            <td>
              <button>-</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="issue-btn-container">
        <button className="add-row-btn">+</button>
        <button className="checkout-btn">Add Stock</button>
      </div>
    </div>
  );
}

export default AddStock;
