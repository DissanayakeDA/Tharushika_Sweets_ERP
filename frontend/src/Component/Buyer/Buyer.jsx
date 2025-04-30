import React, { useState, useEffect } from "react";
import "./Buyer.css";
import axios from "axios";

function Buyer({ buyer, onDelete }) {
  const { _id, name, contact, address, email } = buyer;
  const [showPopup, setShowPopup] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    address: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (showPopup) {
      setInputs({ name, contact, address, email });
    }
  }, [showPopup, name, contact, address, email]);

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

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!inputs.name) {
      formErrors.name = "Buyer name is required";
      isValid = false;
    }

    if (!inputs.contact) {
      formErrors.contact = "Contact number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(inputs.contact)) {
      formErrors.contact = "Must be 10 digits";
      isValid = false;
    }

    if (!inputs.address) {
      formErrors.address = "Address is required";
      isValid = false;
    }
    if (!inputs.email) {
      formErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      formErrors.email = "Invalid email format";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/buyers/${_id}`, inputs);
      window.location.reload();
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
    if (validateForm()) {
      await sendRequest();
      setShowPopup(false);
    }
  };

  return (
    <>
      <tr>
        <td>{_id}</td>
        <td>{name}</td>
        <td>{address}</td>
        <td>{contact}</td>
        <td>{email}</td>
        <td>
          <div className="viewDB-action-icons">
            <button
              onClick={() => setShowPopup(true)}
              className="viewDB-action"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button onClick={deleteHandler} className="viewDB-action">
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>

      {showPopup && (
        <div
          className="viewDB-popup-overlay"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="viewDB-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="viewDB-form-title-dbuyers-popup">
              Update Buyer Details
            </h2>
            <div>
              <div className="viewDB-form-group-dbuyers-popup">
                <label className="viewDB-lable-popup" htmlFor="name">
                  Buyer Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={inputs.name}
                  placeholder="Update buyer name"
                />
                {errors.name && (
                  <span className="viewDB-error">{errors.name}</span>
                )}
              </div>
              <div className="viewDB-form-group-dbuyers-popup">
                <label className="viewDB-lable-popup" htmlFor="contact">
                  Contact Number
                </label>
                <input
                  id="contact"
                  type="text"
                  name="contact"
                  onChange={handleChange}
                  value={inputs.contact}
                  placeholder="Update contact number"
                />
                {errors.contact && (
                  <span className="viewDB-error">{errors.contact}</span>
                )}
              </div>
              <div className="viewDB-form-group-dbuyers-popup">
                <label className="viewDB-lable-popup" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  onChange={handleChange}
                  value={inputs.address}
                  placeholder="Update address"
                />
                {errors.address && (
                  <span className="viewDB-error">{errors.address}</span>
                )}
              </div>
              <div className="viewDB-form-group-dbuyers-popup">
                <label className="viewDB-lable-popup" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={inputs.email}
                  placeholder="Update email address"
                />
                {errors.email && (
                  <span className="viewDB-error">{errors.email}</span>
                )}
              </div>
              <div className="viewDB-popup-buttons">
                <button
                  type="submit"
                  className="viewDB-save-btn-dbuyers-popup"
                  onClick={handleSubmit}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="viewDB-cancel-btn-popup"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buyer;
