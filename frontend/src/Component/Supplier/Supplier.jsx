import React from "react";
import "./Supplier.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Supplier({ supplier, onDelete }) {
  const {
    _id,
    supplier_name,
    supplier_address,
    supplier_phone,
    supplier_email,
  } = supplier;

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`http://localhost:5000/api/suppliers/${_id}`);
        onDelete(_id);
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("Failed to delete the supplier. Please try again.");
      }
    }
  };

  return (
    <tr>
      <td>
        <input type="checkbox" />
      </td>
      <td>{_id}</td>
      <td>{supplier_name}</td>
      <td>{supplier_address}</td>
      <td>{supplier_phone}</td>
      <td>{supplier_email}</td>
      <td>
        <div className="action-icons">
          <Link to={`/viewsuppliers/${_id}`}>
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

export default Supplier;
