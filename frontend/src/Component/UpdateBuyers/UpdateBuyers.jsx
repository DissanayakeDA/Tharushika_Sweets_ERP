import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import "../AddBuyers/AddBuyers.css";
import Nav from "../Nav/Nav";

function UpdateBuyers() {
  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const history = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/buyers/${id}`);
        setInputs(res.data.buyer);
      } catch (err) {
        console.error("Error fetching buyer:", err);
      }
    };
    fetchHandler();
  }, [id]);

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

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/buyers/${id}`, {
        name: inputs.name,
        contact: inputs.contact,
        address: inputs.address,
      });
    } catch (err) {
      console.error("Error updating buyer:", err);
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

    if (!validateForm()) {
      return; 
    }

    await sendRequest();
    history("/viewbuyers"); 
  };

  return (
    <div className="form-container-buyers">
      <Nav />
      <h2 className="form-title">Update Buyers</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group-buyers">
          <label>Buyer Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={inputs.name || ""}
            placeholder="Enter Name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group-buyers">
          <label>Buyer Contact</label>
          <input
            type="text"
            name="contact"
            onChange={handleChange}
            value={inputs.contact || ""}
            placeholder="Enter Contact Number"
          />
          {errors.contact && <span className="error">{errors.contact}</span>}
        </div>


          <div className="form-group-buyers">
          <label>Address</label>

          <input
            type="text"
            name="address"
            onChange={handleChange}
            value={inputs.address || ""}
            placeholder="Enter Buyer Address"
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default UpdateBuyers;
