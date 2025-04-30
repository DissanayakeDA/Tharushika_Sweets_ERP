import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Nav from "../Nav/Nav";
import HeadBar from "../HeadBar/HeadBar";
import "./AddBuyers.css";

const AddBuyers = () => {
  const history = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    address: "",
    email: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    contact: false,
    address: false,
    email: false,
  });

  const [errors, setErrors] = useState({});
  
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
      [e.target.name]: true
    });
    validateField(e.target.name, e.target.value);
  };

  // Validate individual field
  const validateField = (field, value) => {
    let newErrors = {...errors};
    
    switch(field) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Buyer name is required.";
        } else {
          delete newErrors.name;
        }
        break;
      case "contact":
        if (!value) {
          newErrors.contact = "Contact number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.contact = "Contact number must be exactly 10 digits.";
        } else {
          delete newErrors.contact;
        }
        break;
      case "address":
        if (!value.trim()) {
          newErrors.address = "Address is required.";
        } else {
          delete newErrors.address;
        }
        break;
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address.";
        } else {
          delete newErrors.email;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  // Validation for the entire form
  const validateForm = () => {
    // Mark all fields as touched to show all errors
    setTouched({
      name: true,
      contact: true,
      address: true,
      email: true,
    });
    
    let formErrors = {};
    let isValid = true;

    if (!inputs.name.trim()) {
      formErrors.name = "Buyer name is required.";
      isValid = false;
    }

    if (!inputs.contact) {
      formErrors.contact = "Contact number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(inputs.contact)) {
      formErrors.contact = "Contact number must be exactly 10 digits.";
      isValid = false;
    }

    if (!inputs.address.trim()) {
      formErrors.address = "Address is required.";  
      isValid = false;
    }
    
    if (!inputs.email.trim()) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      formErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Validate current step
  const validateStep = (step) => {
    let isValid = true;
    
    if (step === 1) {
      // Step 1 validation (name and contact)
      if (!inputs.name.trim()) {
        setErrors(prev => ({ ...prev, name: "Buyer name is required." }));
        setTouched(prev => ({ ...prev, name: true }));
        isValid = false;
      }
      
      if (!inputs.contact) {
        setErrors(prev => ({ ...prev, contact: "Contact number is required." }));
        setTouched(prev => ({ ...prev, contact: true }));
        isValid = false;
      } else if (!/^\d{10}$/.test(inputs.contact)) {
        setErrors(prev => ({ ...prev, contact: "Contact number must be exactly 10 digits." }));
        setTouched(prev => ({ ...prev, contact: true }));
        isValid = false;
      }
    }
    
    return isValid;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Shake animation for validation errors
      const formElement = document.querySelector('.form-step-content');
      if (formElement) {
        formElement.classList.add('shake');
        setTimeout(() => {
          formElement.classList.remove('shake');
        }, 500);
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Shake the form if validation fails
      const formElement = document.querySelector('.form-step-content');
      if (formElement) {
        formElement.classList.add('shake');
        setTimeout(() => {
          formElement.classList.remove('shake');
        }, 500);
      }
      return;
    }

    setLoading(true);
    
    try {
      await sendRequest();
      setSuccess(true);
      
      // Show success message before redirecting
      setTimeout(() => {
        history("/viewbuyers");
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      // Show error toast
      showToast("Failed to add buyer. Please try again.", "error");
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
    await axios
      .post("http://localhost:5000/buyers", {
        name: String(inputs.name),
        contact: Number(inputs.contact),
        address: String(inputs.address),
        email: String(inputs.email),
      })
      .then((res) => res.data);
  };

  // Reset form
  const handleReset = () => {
    setInputs({
      name: "",
      contact: "",
      address: "",
      email: "",
    });
    setErrors({});
    setTouched({
      name: false,
      contact: false,
      address: false,
      email: false,
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
            <h2 className="form-title">Add New Buyer</h2>
            <div className="progress-bar-container">
              <div className="progress-steps">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div 
                    key={i} 
                    className={`step ${i + 1 <= currentStep ? 'active' : ''} ${i + 1 < currentStep ? 'completed' : ''}`}
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
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
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
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <h3>Buyer Added Successfully!</h3>
              <p>Redirecting to buyers list...</p>
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
                        <p>Enter the buyer's name and contact information</p>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="name">
                          Buyer Name
                          <span className="required-star">*</span>
                        </label>
                        <div className="input-container">
                          <input
                            id="name"
                            type="text"
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputs.name}
                            placeholder="Enter Full Name"
                            className={getFieldClass("name")}
                            disabled={loading}
                          />
                          <div className="input-icon">
                            <i className="fas fa-user"></i>
                          </div>
                          {touched.name && errors.name && (
                            <motion.div 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.name}
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="contact">
                          Contact Number
                          <span className="required-star">*</span>
                        </label>
                        <div className="input-container">
                          <input
                            id="contact"
                            type="tel"
                            name="contact"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputs.contact}
                            placeholder="Enter 10-digit number"
                            className={getFieldClass("contact")}
                            disabled={loading}
                            maxLength={10}
                          />
                          <div className="input-icon">
                            <i className="fas fa-phone"></i>
                          </div>
                          {touched.contact && errors.contact && (
                            <motion.div 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.contact}
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
                        <p>Enter the buyer's address and email</p>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="address">
                          Address
                          <span className="required-star">*</span>
                        </label>
                        <div className="input-container">
                          <textarea
                            id="address"
                            name="address"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputs.address}
                            placeholder="Enter Complete Address"
                            className={`textarea ${getFieldClass("address")}`}
                            disabled={loading}
                            rows={3}
                          />
                          <div className="input-icon textarea-icon">
                            <i className="fas fa-map-marker-alt"></i>
                          </div>
                          {touched.address && errors.address && (
                            <motion.div 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.address}
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email">
                          Email Address
                          <span className="required-star">*</span>
                        </label>
                        <div className="input-container">
                          <input
                            id="email"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={inputs.email}
                            placeholder="Enter Email Address"
                            className={getFieldClass("email")}
                            disabled={loading}
                          />
                          <div className="input-icon">
                            <i className="fas fa-envelope"></i>
                          </div>
                          {touched.email && errors.email && (
                            <motion.div 
                              className="error-message"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {errors.email}
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
                        <>Submit <i className="fas fa-check"></i></>
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
};

export default AddBuyers;