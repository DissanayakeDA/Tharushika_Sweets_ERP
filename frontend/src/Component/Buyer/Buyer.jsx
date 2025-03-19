import React from "react";
import "./Buyer.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Buyer({ buyer, onDelete }) {
  const { _id, name, contact, address } = buyer;

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this buyer?")) {
      try {
        await axios.delete(`http://localhost:5000/buyers/${_id}`);
        onDelete(_id); 
      } catch (error) {
        console.error("Error deleting buyer:", error);
        alert("Failed to delete the buyer. Please try again.");
      }
    }
  };

  return (
    <tr>
      <td>{_id}</td>
      <td>{name}</td>
      <td>{address}</td>
      <td>{contact}</td>
      <td>
        <div className="action-icons">
          <Link to={`/viewbuyers/${_id}`}>
            <button className="action">
              <i className="bi bi-pencil-square"></i>
            </button>
          </Link>
          <button onClick={deleteHandler} className="action">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default Buyer;
