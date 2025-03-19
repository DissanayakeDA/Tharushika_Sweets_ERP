import React, { useState } from "react";
import "./AddSupplier.css";
import GMNav from "../GMNav/GMNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddSupplier = () => {
  const history = useNavigate();

  // State for form inputs and error messages
  const [inputs, setInputs] = useState({
    supplier_name: "",
    supplier_address: "",
    supplier_phone: "",
    supplier_email: "",
  });

  const [errors, setErrors] = useState({}); // State for error messages

  // Handle input change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Validation function
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate Buyer Name
    if (!inputs.supplier_name) {
      formErrors.supplier_name = "Supplier name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(inputs.supplier_name)) {
      formErrors.supplier_name =
        "Supplier name can only contain alphabets and spaces.";
      isValid = false;
    }

    // Validate Contact Number
    if (!inputs.supplier_phone) {
      formErrors.supplier_phone = "Contact number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(inputs.supplier_phone)) {
      formErrors.supplier_phone = "Contact number must be exactly 10 digits.";
      isValid = false;
    }

    // Validate email
    if (!inputs.supplier_email) {
      formErrors.supplier_email = "Email is required.";
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(inputs.supplier_email)
    ) {
      formErrors.supplier_email = "Invalid email address.";
      isValid = false;
    }
    setErrors(formErrors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before sending request
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    console.log(inputs);
    await sendRequest();
    history("/viewsuppliers"); // Navigate to 'viewbuyers' when submission is successful
  };

  // Send request to backend
  const sendRequest = async () => {
    await axios
      .post("http://localhost:5000/api/suppliers", {
        supplier_name: String(inputs.supplier_name),
        supplier_address: String(inputs.supplier_address),
        supplier_phone: String(inputs.supplier_phone),
        supplier_email: String(inputs.supplier_email),
      })
      .then((res) => res.data);
  };

  return (
    <div className="form-container-sup">
      <GMNav />
      <h2 className="form-title-sup">Add Suppliers</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group-sup">
          <label>Supplier Name</label>
          <input
            type="text"
            name="supplier_name"
            onChange={handleChange}
            value={inputs.supplier_name}
            placeholder="Enter Name"
          />
          {errors.name && <span className="error">{errors.supplier_name}</span>}
        </div>
        <div className="form-group-sup">
          <label>Supplier Address</label>
          <input
            type="text"
            name="supplier_address"
            onChange={handleChange}
            value={inputs.supplier_address}
            placeholder="Enter Address"
          />
          {errors.name && (
            <span className="error">{errors.supplier_address}</span>
          )}
        </div>
        <div className="form-group-sup">
          <label>Supplier Phone</label>
          <input
            type="number"
            name="supplier_phone"
            onChange={handleChange}
            value={inputs.supplier_phone}
            placeholder="Enter Contact Number"
          />
          {errors.contact && (
            <span className="error">{errors.supplier_phone}</span>
          )}
        </div>
        <div className="form-group-sup">
          <label>Supplier Email</label>
          <input
            type="email"
            name="supplier_email"
            onChange={handleChange}
            value={inputs.supplier_email}
            placeholder="Enter Email"
          />
          {errors.email && (
            <span className="error">{errors.supplier_email}</span>
          )}
        </div>
        <button type="submit" className="save-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;
