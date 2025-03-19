import React from "react";
import "./GMBuyer.css";

function GMBuyer({ buyer }) {
  const { _id, name, contact, date } = buyer;

  return (
    <tr>
      <td>
        <input type="checkbox" />
      </td>
      <td>{_id}</td>
      <td>{name}</td>
      <td>{date}</td>
      <td>{contact}</td>
    </tr>
  );
}

export default GMBuyer;
