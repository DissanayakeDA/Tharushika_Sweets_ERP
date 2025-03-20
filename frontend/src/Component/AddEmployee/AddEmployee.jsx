import React, { useState } from "react";
import "./AddEmployee.css";
import HRNav from "../HRNav/HRNav";
import HeadBar from "../HeadBar/HeadBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddEmployee = () => {
  const history = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    mobileNo: "",
    position: "",
    salary: "",
    bankAccountNo: "",
    bank: "",
    branch: "",
    nicNo: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!inputs.name) {
      formErrors.name = "Employee name is required.";
      isValid = false;
    }

    if (!inputs.mobileNo) {
      formErrors.mobileNo = "Mobile number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(inputs.mobileNo)) {
      formErrors.mobileNo = "Mobile number must be exactly 10 digits.";
      isValid = false;
    }

    if (!inputs.position) {
      formErrors.position = "Position is required.";
      isValid = false;
    }

    if (!inputs.salary) {
      formErrors.salary = "Salary is required.";
      isValid = false;
    } else if (isNaN(inputs.salary) || Number(inputs.salary) <= 0) {
      formErrors.salary = "Salary must be a positive number.";
      isValid = false;
    }

    if (!inputs.bankAccountNo) {
      formErrors.bankAccountNo = "Bank account number is required.";
      isValid = false;
    }

    if (!inputs.bank) {
      formErrors.bank = "Bank name is required.";
      isValid = false;
    }

    if (!inputs.branch) {
      formErrors.branch = "Branch is required.";
      isValid = false;
    }

    if (!inputs.nicNo) {
      formErrors.nicNo = "NIC number is required.";
      isValid = false;
    } else if (!/^[0-9]{9}[vV]$|^[0-9]{12}$/.test(inputs.nicNo)) {
      formErrors.nicNo = "NIC must be 9 digits + 'v' or 12 digits.";
      isValid = false;
    }

    if (!inputs.dateOfBirth) {
      formErrors.dateOfBirth = "Date of birth is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log(inputs);
    try {
      await sendRequest();
      history("/viewemployees");
    } catch (error) {
      console.error("Error adding employee:", error);
      setErrors({ submit: "Failed to add employee. Please try again." });
    }
  };

  const sendRequest = async () => {
    const response = await axios.post("http://localhost:5000/api/employee", {
      name: String(inputs.name),
      mobileNo: String(inputs.mobileNo),
      position: String(inputs.position),
      salary: Number(inputs.salary),
      bankAccountNo: String(inputs.bankAccountNo),
      bank: String(inputs.bank),
      branch: String(inputs.branch),
      nicNo: String(inputs.nicNo),
      dateOfBirth: String(inputs.dateOfBirth),
    });
    return response.data;
  };

  return (
    <div className="form-container-buyers">
      <HeadBar />
      <HRNav />
      <div className="form-content">
        <div className="form-box">
          <h2 className="form-title">Add New Employee</h2>
          <form onSubmit={handleSubmit}>
            {/* Section: Personal Details */}
            <div className="form-section">
              <h3 className="section-title">Personal Details</h3>
              <div className="form-group-buyers">
                <label>Employee Name:</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={inputs.name}
                  placeholder="Enter Name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="form-group-buyers">
                <label>Mobile Number:</label>
                <input
                  type="text"
                  name="mobileNo"
                  onChange={handleChange}
                  value={inputs.mobileNo}
                  placeholder="Enter Mobile Number"
                />
                {errors.mobileNo && <span className="error">{errors.mobileNo}</span>}
              </div>
              <div className="form-group-buyers">
                <label>NIC Number:</label>
                <input
                  type="text"
                  name="nicNo"
                  onChange={handleChange}
                  value={inputs.nicNo}
                  placeholder="Enter NIC Number"
                />
                {errors.nicNo && <span className="error">{errors.nicNo}</span>}
              </div>
              <div className="form-group-buyers">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  onChange={handleChange}
                  value={inputs.dateOfBirth}
                />
                {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
              </div>
            </div>

            {/* Section: Job Details */}
            <div className="form-section">
              <h3 className="section-title">Job Details</h3>
              <div className="form-group-buyers">
                <label>Position:</label>
                <input
                  type="text"
                  name="position"
                  onChange={handleChange}
                  value={inputs.position}
                  placeholder="Enter Position"
                />
                {errors.position && <span className="error">{errors.position}</span>}
              </div>
              <div className="form-group-buyers">
                <label>Salary:</label>
                <input
                  type="number"
                  name="salary"
                  onChange={handleChange}
                  value={inputs.salary}
                  placeholder="Enter Salary"
                />
                {errors.salary && <span className="error">{errors.salary}</span>}
              </div>
            </div>

            {/* Section: Bank Details */}
            <div className="form-section">
              <h3 className="section-title">Bank Details</h3>
              <div className="form-group-buyers">
                <label>Bank Account No:</label>
                <input
                  type="text"
                  name="bankAccountNo"
                  onChange={handleChange}
                  value={inputs.bankAccountNo}
                  placeholder="Enter Bank Account Number"
                />
                {errors.bankAccountNo && <span className="error">{errors.bankAccountNo}</span>}
              </div>
              <div className="form-group-buyers">
                <label>Bank:</label>
                <input
                  type="text"
                  name="bank"
                  onChange={handleChange}
                  value={inputs.bank}
                  placeholder="Enter Bank Name"
                />
                {errors.bank && <span className="error">{errors.bank}</span>}
              </div>
              <div className="form-group-buyers">
                <label>Branch:</label>
                <input
                  type="text"
                  name="branch"
                  onChange={handleChange}
                  value={inputs.branch}
                  placeholder="Enter Branch"
                />
                {errors.branch && <span className="error">{errors.branch}</span>}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="save-btn">
              Add Employee
            </button>
            {errors.submit && <span className="error submit-error">{errors.submit}</span>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;