import React from "react";
import "./Supplier.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Supplier({ supplier }) {
  const {
    _id,
    supplier_name,
    supplier_address,
    supplier_phone,
    supplier_email,
  } = supplier;

  return (
    <tr>
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
          <button className="action">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default Supplier;
