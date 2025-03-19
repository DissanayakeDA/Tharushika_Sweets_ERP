import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import "../AddSupplier/AddSupplier.css";
import Nav from "../Nav/Nav";

function UpdateSupplier() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/suppliers/${id}`
        );
        setInputs(res.data.data); // Ensure the response structure is correct
      } catch (err) {
        console.error("Error fetching supplier:", err);
      }
    };

    if (id) {
      fetchHandler();
    }
  }, [id]);

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/api/suppliers/${id}`, {
        supplier_name: inputs.supplier_name,
        supplier_address: inputs.supplier_address,
        supplier_phone: inputs.supplier_phone,
        supplier_email: inputs.supplier_email,
      });
    } catch (err) {
      console.error("Error updating supplier:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
    history("/viewsuppliers");
  };

  return (
    <div className="form-container">
      <Nav />
      <h2 className="form-title">Update Supplier</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group-sup">
          <label>Supplier Name</label>
          <input
            type="text"
            name="supplier_name"
            onChange={handleChange}
            value={inputs.supplier_name || ""}
            placeholder="Enter Name"
          />
        </div>
        <div className="form-group-sup">
          <label>Supplier Address</label>
          <input
            type="text"
            name="supplier_address"
            onChange={handleChange}
            value={inputs.supplier_address || ""}
            placeholder="Enter Address"
          />
        </div>
        <div className="form-group-sup">
          <label>Supplier Phone</label>
          <input
            type="number"
            name="supplier_phone"
            onChange={handleChange}
            value={inputs.supplier_phone || ""}
            placeholder="Enter Contact Number"
          />
        </div>
        <div className="form-group-sup">
          <label>Supplier Email</label>
          <input
            type="email"
            name="supplier_email"
            onChange={handleChange}
            value={inputs.supplier_email || ""}
            placeholder="Enter Email"
          />
        </div>
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default UpdateSupplier;
