import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../AddSupplier/AddSupplier.css";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import { motion } from "framer-motion";

function UpdateSupplier() {
  const history = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [inputs, setInputs] = useState({
    supplier_name: "",
    supplier_address: "",
    supplier_phone: "",
    supplier_email: "",
  });

  const [touched, setTouched] = useState({
    supplier_name: false,
    supplier_address: false,
    supplier_phone: false,
    supplier_email: false,
  });

  const [errors, setErrors] = useState({});

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

  // Handle input change with visual feedback
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate the field as user types
    validateField(name, value);
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    });
    validateField(e.target.name, e.target.value);
  };

  // Validate individual field
  const validateField = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case "supplier_name":
        if (!value.trim()) {
          newErrors.supplier_name = "Supplier name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors.supplier_name =
            "Supplier name can only contain alphabets and spaces.";
        } else {
          delete newErrors.supplier_name;
        }
        break;
      case "supplier_phone":
        if (!value) {
          newErrors.supplier_phone = "Contact number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.supplier_phone =
            "Contact number must be exactly 10 digits.";
        } else {
          delete newErrors.supplier_phone;
        }
        break;
      case "supplier_address":
        if (!value.trim()) {
          newErrors.supplier_address = "Address is required.";
        } else {
          delete newErrors.supplier_address;
        }
        break;
      case "supplier_email":
        if (!value.trim()) {
          newErrors.supplier_email = "Email is required.";
        } else if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value)) {
          newErrors.supplier_email = "Invalid email address.";
        } else {
          delete newErrors.supplier_email;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // Validation for the entire form
  const validateForm = () => {
    setTouched({
      supplier_name: true,
      supplier_address: true,
      supplier_phone: true,
      supplier_email: true,
    });

    let formErrors = {};
    let isValid = true;

    if (!inputs.supplier_name.trim()) {
      formErrors.supplier_name = "Supplier name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(inputs.supplier_name)) {
      formErrors.supplier_name =
        "Supplier name can only contain alphabets and spaces.";
      isValid = false;
    }

    if (!inputs.supplier_phone) {
      formErrors.supplier_phone = "Contact number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(inputs.supplier_phone)) {
      formErrors.supplier_phone = "Contact number must be exactly 10 digits.";
      isValid = false;
    }

    if (!inputs.supplier_address.trim()) {
      formErrors.supplier_address = "Address is required.";
      isValid = false;
    }

    if (!inputs.supplier_email.trim()) {
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

  // Validate current step
  const validateStep = (step) => {
    let isValid = true;

    if (step === 1) {
      if (!inputs.supplier_name.trim()) {
        setErrors((prev) => ({
          ...prev,
          supplier_name: "Supplier name is required.",
        }));
        setTouched((prev) => ({ ...prev, supplier_name: true }));
        isValid = false;
      } else if (!/^[A-Za-z\s]+$/.test(inputs.supplier_name)) {
        setErrors((prev) => ({
          ...prev,
          supplier_name: "Supplier name can only contain alphabets and spaces.",
        }));
        setTouched((prev) => ({ ...prev, supplier_name: true }));
        isValid = false;
      }

      if (!inputs.supplier_phone) {
        setErrors((prev) => ({
          ...prev,
          supplier_phone: "Contact number is required.",
        }));
        setTouched((prev) => ({ ...prev, supplier_phone: true }));
        isValid = false;
      } else if (!/^\d{10}$/.test(inputs.supplier_phone)) {
        setErrors((prev) => ({
          ...prev,
          supplier_phone: "Contact number must be exactly 10 digits.",
        }));
        setTouched((prev) => ({ ...prev, supplier_phone: true }));
        isValid = false;
      }
    }

    return isValid;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const formElement = document.querySelector(".form-step-content");
      if (formElement) {
        formElement.classList.add("shake");
        setTimeout(() => {
          formElement.classList.remove("shake");
        }, 500);
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const formElement = document.querySelector(".form-step-content");
      if (formElement) {
        formElement.classList.add("shake");
        setTimeout(() => {
          formElement.classList.remove("shake");
        }, 500);
      }
      return;
    }

    setLoading(true);

    try {
      await sendRequest();
      setSuccess(true);

      setTimeout(() => {
        history("/viewsuppliers");
      }, 2000);
    } catch (error) {
      console.error("Error updating supplier:", error);
      setLoading(false);
      showToast("Failed to update supplier. Please try again.", "error");
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Send request to backend
  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/api/suppliers/${id}`, {
      supplier_name: String(inputs.supplier_name),
      supplier_address: String(inputs.supplier_address),
      supplier_phone: String(inputs.supplier_phone),
      supplier_email: String(inputs.supplier_email),
    });
  };

  // Reset form
  const handleReset = () => {
    setInputs({
      supplier_name: "",
      supplier_address: "",
      supplier_phone: "",
      supplier_email: "",
    });
    setErrors({});
    setTouched({
      supplier_name: false,
      supplier_address: false,
      supplier_phone: false,
      supplier_email: false,
    });
    setCurrentStep(1);
  };

  // Get input field status class
  const getFieldClass = (fieldName) => {
    if (!touched[fieldName]) return "";
    return errors[fieldName] ? "input-error" : "input-valid";
  };

  return (
    <div className="add-buyers-container">
      <HeadBar />
      <Nav />
      <div className="content-wrapper">
        <motion.div
          className="form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <h2 className="form-title">Update Supplier</h2>
            <div className="progress-bar-container">
              <div className="progress-steps">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`step ${i + 1 <= currentStep ? "active" : ""} ${
                      i + 1 < currentStep ? "completed" : ""
                    }`}
                  >
                    {i + 1 < currentStep ? (
                      <span className="step-check">✓</span>
                    ) : (
                      <span className="step-number">{i + 1}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="progress-line">
                <div
                  className="progress-line-inner"
                  style={{
                    width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {success ? (
            <motion.div
              className="success-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="success-icon">
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark-circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark-check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <h3>Supplier Updated Successfully!</h3>
              <p>Redirecting to suppliers list...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className={loading ? "loading" : ""}>
              <div className="form-step-wrapper">
                <motion.div
                  className="form-step-content"
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && (
                    <>
                      <div className="step-title">
                        <h3>Basic Information</h3>
                        <p>
                          Update the supplier's name and contact information
                        </p>
                      </div>

                      <div className="form-group">
                        <label htmlFor="supplier_name">
                          Supplier Name
                          <span className="required-star">*</span>
                        </label>
                        <div className="input-container">
                          <input
                            id="supplier_name"
                            type="text"
                            name="supplier_name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputs.supplier_name || ""}
                            placeholder="Enter Supplier Name"
                            className={getFieldClass("supplier_name")}
                            disabled={loading}
                          />
                          <div className="input-icon">
                            <i className="fas fa-user"></i>
                          </div>
                          {touched.supplier_name && errors.supplier_name && (
                            <motion.div
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.supplier_name}
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="supplier_phone">
                          Contact Number
                          <span className="required-star">*</span>
                        </label>
                        <div className="input-container">
                          <input
                            id="supplier_phone"
                            type="tel"
                            name="supplier_phone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputs.supplier_phone || ""}
                            placeholder="Enter 10-digit number"
                            className={getFieldClass("supplier_phone")}
                            disabled={loading}
                            maxLength={10}
                          />
                          <div className="input-icon">
                            <i className="fas fa-phone"></i>
                          </div>
                          {touched.supplier_phone && errors.supplier_phone && (
                            <motion.div
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.supplier_phone}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div className="step-title">
                        <h3>Additional Details</h3>
                        <p>Update the supplier's address and email</p>
                      </div>

                      <div className="form-group">
                        <label htmlFor="supplier_address">
                          Address
                          <span className="required-star">*</span>
                        </label>
                        <div className="input-container">
                          <textarea
                            id="supplier_address"
                            name="supplier_address"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputs.supplier_address || ""}
                            placeholder="Enter Supplier Address"
                            className={`textarea ${getFieldClass(
                              "supplier_address"
                            )}`}
                            disabled={loading}
                            rows={3}
                          />
                          <div className="input-icon textarea-icon">
                            <i className="fas fa-map-marker-alt"></i>
                          </div>
                          {touched.supplier_address &&
                            errors.supplier_address && (
                              <motion.div
                                className="error-message"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {errors.supplier_address}
                              </motion.div>
                            )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="supplier_email">
                          Email Address
                          <span className="required-star">*</span>
                        </label>
                        <div className="input-container">
                          <input
                            id="supplier_email"
                            type="email"
                            name="supplier_email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputs.supplier_email || ""}
                            placeholder="Enter Email Address"
                            className={getFieldClass("supplier_email")}
                            disabled={loading}
                          />
                          <div className="input-icon">
                            <i className="fas fa-envelope"></i>
                          </div>
                          {touched.supplier_email && errors.supplier_email && (
                            <motion.div
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.supplier_email}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>

              <div className="form-actions">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handlePrevStep}
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleNextStep}
                    disabled={loading}
                  >
                    Next <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <div className="final-buttons">
                    <button
                      type="button"
                      className="btn-outlined"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Reset
                    </button>

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="loader"></div>
                      ) : (
                        <>
                          Save <i className="fas fa-check"></i>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default UpdateSupplier;
