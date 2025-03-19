import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import "../AddBuyers/AddBuyers.css";
import Nav from "../Nav/Nav";

function UpdateBuyers() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const { id } = useParams(); // Ensure `id` is destructured properly

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

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:5000/buyers/${id}`, {
        name: inputs.name,
        contact: inputs.contact,
        date: inputs.date, // Backend should handle the correct format
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
    await sendRequest();
    history("/viewbuyers"); // Redirect to buyers list
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
        </div>
        <div className="form-group-buyers">
          <label>Buyer Contact</label>
          <input
            type="number"
            name="contact"
            onChange={handleChange}
            value={inputs.contact || ""}
            placeholder="Enter Contact Number"
          />
        </div>
        <div className="form-group-buyers">
          <label>Date</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            value={inputs.date ? inputs.date.split("T")[0] : ""}
          />
        </div>
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default UpdateBuyers;
