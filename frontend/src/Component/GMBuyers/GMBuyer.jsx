import React from "react";
import "./GMBuyer.css";

function GMBuyer({ buyer }) {
  const { _id, name, contact, address } = buyer;

  return (
    <tr>
      
      <td>{_id}</td>
      <td>{name}</td>
      <td>{address}</td>
      <td>{contact}</td>
    </tr>
  );
}

export default GMBuyer;
