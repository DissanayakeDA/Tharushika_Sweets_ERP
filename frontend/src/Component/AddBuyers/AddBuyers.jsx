import React, { useState } from "react";
import "./AddBuyers.css";
import Nav from "../Nav/Nav";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AddBuyers = () => {
  const history = useNavigate();

  // State for form inputs and error messages
  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    date: "",
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
    if (!inputs.name) {
      formErrors.name = "Buyer name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(inputs.name)) {
      formErrors.name = "Buyer name can only contain alphabets and spaces.";
      isValid = false;
    }

    // Validate Contact Number
    if (!inputs.contact) {
      formErrors.contact = "Contact number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(inputs.contact)) {
      formErrors.contact = "Contact number must be exactly 10 digits.";
      isValid = false;
    }

    // Validate Date (ensure it's not a past date)
    if (!inputs.date) {
      formErrors.date = "Date is required.";
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
    history('/viewbuyers');  // Navigate to 'viewbuyers' when submission is successful
  };

  // Send request to backend
  const sendRequest = async () => {
    await axios.post("http://localhost:5000/buyers", {
      name: String(inputs.name),
      contact: Number(inputs.contact),
      address: Number(inputs.address),
      date: inputs.date,
    }).then(res => res.data);
  };

  // Get the current date in YYYY-MM-DD format for the min date attribute
  const currentDate = new Date().toISOString().split("T")[0];

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
            type="number"
            name="contact"
            onChange={handleChange}
            value={inputs.contact}
            placeholder="Enter Contact Number"
          />
          {errors.contact && <span className="error">{errors.contact}</span>}
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            value={inputs.date}
            min={currentDate} // Set min date to today
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>
        <button type="submit" className="save-btn">Submit</button>
      </form>
    </div>
  );
};

export default AddBuyers;
