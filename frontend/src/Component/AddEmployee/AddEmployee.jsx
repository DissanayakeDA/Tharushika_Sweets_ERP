import React, { useState, useEffect } from "react";
import "./AddEmployee.css";
import HRNav from "../HRNav/HRNav";
import HeadBar from "../HeadBar/HeadBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Reusable Alert Component
const Alert = ({ messages, onDismiss }) => (
  <div className="error-alert-top" onClick={onDismiss}>
    <div className="error-alert-content">
      <span className="error-icon">⚠️</span>
      <div className="error-messages">
        {messages.map((message, index) => (
          <p key={index} className="error-message">{message}</p>
        ))}
      </div>
    </div>
  </div>
);

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

  const [errorMessages, setErrorMessages] = useState([]);

  const sriLankanBanks = [
    "Amana Bank PLC",
    "Axis Bank Ltd.",
    "Bank of Ceylon",
    "Cargills Bank Ltd.",
    "Citibank N.A.",
    "Commercial Bank of Ceylon PLC",
    "Deutsche Bank AG",
    "DFCC Bank PLC",
    "Habib Bank Ltd.",
    "Hatton National Bank PLC",
    "HSBC",
    "ICICI Bank Ltd.",
    "Indian Bank",
    "Indian Overseas Bank",
    "MCB Bank Ltd.",
    "National Development Bank PLC",
    "Nations Trust Bank PLC",
    "Pan Asia Banking Corporation PLC",
    "People's Bank",
    "Public Bank Berhad",
    "Sampath Bank PLC",
    "Seylan Bank PLC",
    "Standard Chartered Bank",
    "State Bank of India",
    "Union Bank of Colombo PLC",
  ];

  const handleDismiss = () => {
    setErrorMessages([]);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (errorMessages.length > 0) {
        setErrorMessages([]);
      }
    };

    if (errorMessages.length > 0) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [errorMessages]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateBankAccountNumber = (bank, accountNo) => {
    if (!accountNo) return "Bank account number is required.";
    const bankFormats = {
      "Bank of Ceylon": /^\d{12,15}$/,
      "People's Bank": /^\d{15}$/,
      "Commercial Bank of Ceylon PLC": /^\d{10,12}$/,
      "Sampath Bank PLC": /^\d{12}$/,
      "Hatton National Bank PLC": /^\d{12}$/,
      "Seylan Bank PLC": /^\d{12}$/,
      "National Development Bank PLC": /^\d{12}$/,
    };
    const regex = bankFormats[bank] || /^\d{10,16}$/;
    return regex.test(accountNo)
      ? null
      : `Invalid account number format for ${bank}.`;
  };

  const validateForm = () => {
    let formErrors = {};
    let messages = [];
    let isValid = true;

    if (!inputs.name) {
      formErrors.name = true;
      messages.push("Employee name is required.");
      isValid = false;
    }

    if (!inputs.mobileNo) {
      formErrors.mobileNo = true;
      messages.push("Mobile number is required.");
      isValid = false;
    } else if (!/^\d{10}$/.test(inputs.mobileNo)) {
      formErrors.mobileNo = true;
      messages.push("Mobile number must be exactly 10 digits.");
      isValid = false;
    }

    if (!inputs.position) {
      formErrors.position = true;
      messages.push("Position is required.");
      isValid = false;
    }

    if (!inputs.salary) {
      formErrors.salary = true;
      messages.push("Salary is required.");
      isValid = false;
    } else if (isNaN(inputs.salary) || Number(inputs.salary) <= 0) {
      formErrors.salary = true;
      messages.push("Salary must be a positive number.");
      isValid = false;
    }

    const bankAccountError = validateBankAccountNumber(inputs.bank, inputs.bankAccountNo);
    if (bankAccountError) {
      formErrors.bankAccountNo = true;
      messages.push(bankAccountError);
      isValid = false;
    }

    if (!inputs.bank) {
      formErrors.bank = true;
      messages.push("Bank name is required.");
      isValid = false;
    }

    if (!inputs.branch) {
      formErrors.branch = true;
      messages.push("Branch is required.");
      isValid = false;
    }

    if (!inputs.nicNo) {
      formErrors.nicNo = true;
      messages.push("NIC number is required.");
      isValid = false;
    } else if (!/^[0-9]{9}[vV]$|^[0-9]{12}$/.test(inputs.nicNo)) {
      formErrors.nicNo = true;
      messages.push("NIC must be 9 digits + 'v' or 12 digits.");
      isValid = false;
    }

    if (!inputs.dateOfBirth) {
      formErrors.dateOfBirth = true;
      messages.push("Date of birth is required.");
      isValid = false;
    }

    setErrorMessages(messages);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    try {
      await sendRequest();
      history("/viewemployees");
    } catch (error) {
      console.error("Error adding employee:", error);
      setErrorMessages(["Failed to add employee. Please try again."]);
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
    <>
      <HeadBar /> {/* Moved outside the container */}
      <div className="form-container-buyers">
        <HRNav />
        <div className="form-content">
          <div className="form-box">
            <h2 className="form-title">Add New Employee</h2>
            {errorMessages.length > 0 && <Alert messages={errorMessages} onDismiss={handleDismiss} />}
            <form onSubmit={handleSubmit}>
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
                </div>
                <div className="form-group-buyers">
                  <label>Date of Birth:</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    onChange={handleChange}
                    value={inputs.dateOfBirth}
                  />
                </div>
              </div>
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
                </div>
              </div>
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
                </div>
                <div className="form-group-buyers">
                  <label>Bank:</label>
                  <select
                    name="bank"
                    onChange={handleChange}
                    value={inputs.bank}
                  >
                    <option value="">Select a Bank</option>
                    {sriLankanBanks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
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
                </div>
              </div>
              <button type="submit" className="save-btn">
                Add Employee
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;