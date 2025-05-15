import React, { useState, useEffect } from "react";
import "./UpdateEmployee.css";
import HRNav from "../HRNav/HRNav";
import HeadBar from "../HeadBar/HeadBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/${id}`
        );
        if (response.data.success) {
          const employee = response.data.data;
          setInputs({
            name: employee.name || "",
            mobileNo: employee.mobileNo || "",
            position: employee.position || "",
            salary: employee.salary || "",
            bankAccountNo: employee.bankAccountNo || "",
            bank: employee.bank || "",
            branch: employee.branch || "",
            nicNo: employee.nicNo || "",
            dateOfBirth: employee.dateOfBirth
              ? employee.dateOfBirth.split("T")[0]
              : "",
          });
        } else {
          setErrors({ fetch: "Failed to load employee data." });
        }
      } catch (error) {
        console.error(
          "Error fetching employee:",
          error.response?.data || error.message
        );
        setErrors({
          fetch: "Error fetching employee data. Please check the ID or server.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

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
    if (!inputs.mobileNo || !/^\d{10}$/.test(inputs.mobileNo)) {
      formErrors.mobileNo = "Mobile number must be 10 digits.";
      isValid = false;
    }
    if (!inputs.position) {
      formErrors.position = "Position is required.";
      isValid = false;
    }
    if (!inputs.salary || isNaN(inputs.salary) || Number(inputs.salary) <= 0) {
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
    if (!inputs.nicNo || !/^[0-9]{9}[vV]$|^[0-9]{12}$/.test(inputs.nicNo)) {
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

    if (!validateForm()) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/employee/${id}`,
        inputs
      );
      if (response.data.success) {
        navigate("/viewemployees");
      } else {
        setErrors({
          submit: response.data.message || "Failed to update employee.",
        });
      }
    } catch (error) {
      console.error(
        "Error updating employee:",
        error.response?.data || error.message
      );
      setErrors({
        submit:
          error.response?.data?.message ||
          "Error updating employee. Please try again.",
      });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <HeadBar />
      <div className="form-container-buyers">
        <HRNav />
        <div className="form-content">
          <div className="form-box">
            <h2 className="form-title">Update Employee</h2>

            {errors.fetch && (
              <span className="error submit-error">{errors.fetch}</span>
            )}

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
                  />
                  {errors.mobileNo && (
                    <span className="error">{errors.mobileNo}</span>
                  )}
                </div>
                <div className="form-group-buyers">
                  <label>NIC Number:</label>
                  <input
                    type="text"
                    name="nicNo"
                    onChange={handleChange}
                    value={inputs.nicNo}
                    disabled
                  />
                  {errors.nicNo && (
                    <span className="error">{errors.nicNo}</span>
                  )}
                </div>
                <div className="form-group-buyers">
                  <label>Date of Birth:</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    onChange={handleChange}
                    value={inputs.dateOfBirth}
                  />
                  {errors.dateOfBirth && (
                    <span className="error">{errors.dateOfBirth}</span>
                  )}
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
                  />
                  {errors.position && (
                    <span className="error">{errors.position}</span>
                  )}
                </div>
                <div className="form-group-buyers">
                  <label>Salary:</label>
                  <input
                    type="number"
                    name="salary"
                    onChange={handleChange}
                    value={inputs.salary}
                  />
                  {errors.salary && (
                    <span className="error">{errors.salary}</span>
                  )}
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
                  />
                  {errors.bankAccountNo && (
                    <span className="error">{errors.bankAccountNo}</span>
                  )}
                </div>
                <div className="form-group-buyers">
                  <label>Bank:</label>
                  <input
                    type="text"
                    name="bank"
                    onChange={handleChange}
                    value={inputs.bank}
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
                  />
                  {errors.branch && (
                    <span className="error">{errors.branch}</span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="save-btn">
                Update Employee
              </button>
              {errors.submit && (
                <span className="error submit-error">{errors.submit}</span>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateEmployee;
