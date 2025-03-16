import React from "react";
import Nav from "../Nav/Nav";
import "./AddStock.css";

function AddStock() {
  return (
    <>
      <Nav />
      <h2 className="title">Add Stock</h2>

      <div className="issue-items-container">
        <button>Add Ingredients</button>
        <button>Add Items to Stock</button>
      </div>
    </>
  );
}

export default AddStock;
