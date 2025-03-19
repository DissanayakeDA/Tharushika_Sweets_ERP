import React, { useState } from "react";
import "./AddBuyers.css";
import Nav from "../Nav/Nav";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AddBuyers = () => {
  const history = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    address: "",
  });
  
  const [errors, setErrors] = useState({}); 

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

    if (!inputs.name) {
      formErrors.name = "Buyer name is required.";
      isValid = false;
    } 

  if (!inputs.contact) {
    formErrors.contact = "Contact number is required.";
    isValid = false;
  } else if (!/^\d{10}$/.test(inputs.contact)) {
    formErrors.contact = "Contact number must be exactly 10 digits and contain only numbers.";
    isValid = false;
  }

    if (!inputs.address) {
      formErrors.address = "Address is required.";
      isValid = false;
    } 

    setErrors(formErrors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; 
    }

    console.log(inputs);
    await sendRequest();
    history('/viewbuyers');  
  };

  // Send request to backend
  const sendRequest = async () => {
    await axios.post("http://localhost:5000/buyers", {
      name: String(inputs.name),
      contact: Number(inputs.contact),
      address: String(inputs.address),
    }).then(res => res.data);
  };

  return (
    <div className="form-container">
      <Nav />
      <h2 className="form-title">Add Buyers</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Buyer Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={inputs.name}
            placeholder="Enter Name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Buyer Contact</label>
          <input
            type="text"
            name="contact"
            onChange={handleChange}
            value={inputs.contact}
            placeholder="Enter Contact Number"
          />
          {errors.contact && <span className="error">{errors.contact}</span>}
        </div>
        
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            onChange={handleChange}
            value={inputs.address}
            placeholder="Enter Buyer Address"
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <button type="submit" className="save-btn">Submit</button>
      </form>
    </div>
  );
};

export default AddBuyers;
