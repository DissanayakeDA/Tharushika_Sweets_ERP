import React, { useState } from "react";
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
import "./AddShop.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStore,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faChevronLeft,
  faChevronRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

function AddShop() {
  // State for form data
  const [formData, setFormData] = useState({
    buyername: "",
    shopname: "",
    contact: "",
    email: "",
    address: "",
  });

  // State for form steps
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // State for success message and API error
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Mark field as touched when user focuses out
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "buyername":
        if (!value.trim()) {
          errorMessage = "Buyer name is required";
        }
        break;
      case "shopname":
        if (!value.trim()) {
          errorMessage = "Shop name is required";
        }
        break;
      case "contact":
        if (!value) {
          errorMessage = "Contact number is required";
        } else if (!/^\d{10}$/.test(value)) {
          errorMessage = "Contact must be exactly 10 digits";
        }
        break;
      case "email":
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          errorMessage = "Invalid email address";
        }
        break;
      case "address":
        if (!value.trim()) {
          errorMessage = "Address is required";
        }
        break;
      default:
        break;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));

    return !errorMessage;
  };

  // Validate current step fields
  const validateCurrentStep = () => {
    let isValid = true;
    let errors = {};
    let touched = {};

    if (currentStep === 1) {
      // First step validation
      if (!formData.buyername.trim()) {
        errors.buyername = "Buyer name is required";
        isValid = false;
      }

      if (!formData.shopname.trim()) {
        errors.shopname = "Shop name is required";
        isValid = false;
      }

      touched.buyername = true;
      touched.shopname = true;
    } else if (currentStep === 2) {
      // Second step validation
      if (!formData.contact) {
        errors.contact = "Contact number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.contact)) {
        errors.contact = "Contact must be exactly 10 digits";
        isValid = false;
      }

      if (
        formData.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
      ) {
        errors.email = "Invalid email address";
        isValid = false;
      }

      if (!formData.address.trim()) {
        errors.address = "Address is required";
        isValid = false;
      }

      touched.contact = true;
      touched.email = true;
      touched.address = true;
    }

    setValidationErrors(errors);
    setTouchedFields((prev) => ({ ...prev, ...touched }));
    return isValid;
  };

  // Handle next button click
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if form is valid; if not, stop submission
    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/indirectbuyers/",
        formData
      );
      if (response.data.success) {
        setShowSuccess(true);
        setError("");
        // Reset form
        setFormData({
          buyername: "",
          shopname: "",
          contact: "",
          email: "",
          address: "",
        });
        setValidationErrors({});
        setTouchedFields({});
        setCurrentStep(1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding shop");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Render form steps based on current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="addshop-form-step-content">
            <div className="addshop-step-title">
              <h3>Shop Details</h3>
              <p>Enter the basic information about the shop</p>
            </div>

            <div className="addshop-form-group">
              <label htmlFor="buyername">
                Buyer Name <span className="addshop-required-star">*</span>
              </label>
              <div className="addshop-input-container">
                <FontAwesomeIcon icon={faUser} className="addshop-input-icon" />
                <input
                  type="text"
                  id="buyername"
                  name="buyername"
                  value={formData.buyername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter buyer name"
                  className={
                    touchedFields.buyername
                      ? validationErrors.buyername
                        ? "addshop-input-error"
                        : "addshop-input-valid"
                      : ""
                  }
                />
              </div>
              {validationErrors.buyername && (
                <p className="addshop-error-message">
                  {validationErrors.buyername}
                </p>
              )}
            </div>

            <div className="addshop-form-group">
              <label htmlFor="shopname">
                Shop Name <span className="addshop-required-star">*</span>
              </label>
              <div className="addshop-input-container">
                <FontAwesomeIcon
                  icon={faStore}
                  className="addshop-input-icon"
                />
                <input
                  type="text"
                  id="shopname"
                  name="shopname"
                  value={formData.shopname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter shop name"
                  className={
                    touchedFields.shopname
                      ? validationErrors.shopname
                        ? "addshop-input-error"
                        : "addshop-input-valid"
                      : ""
                  }
                />
              </div>
              {validationErrors.shopname && (
                <p className="addshop-error-message">
                  {validationErrors.shopname}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="addshop-form-step-content">
            <div className="addshop-step-title">
              <h3>Contact Information</h3>
              <p>Provide contact details for the shop</p>
            </div>

            <div className="addshop-form-group">
              <label htmlFor="contact">
                Contact Number <span className="addshop-required-star">*</span>
              </label>
              <div className="addshop-input-container">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="addshop-input-icon"
                />
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter contact number"
                  className={
                    touchedFields.contact
                      ? validationErrors.contact
                        ? "addshop-input-error"
                        : "addshop-input-valid"
                      : ""
                  }
                />
              </div>
              {validationErrors.contact && (
                <p className="addshop-error-message">
                  {validationErrors.contact}
                </p>
              )}
            </div>

            <div className="addshop-form-group">
              <label htmlFor="email">Email</label>
              <div className="addshop-input-container">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="addshop-input-icon"
                />
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter email"
                  className={
                    touchedFields.email && formData.email
                      ? validationErrors.email
                        ? "addshop-input-error"
                        : "addshop-input-valid"
                      : ""
                  }
                />
              </div>
              {validationErrors.email && (
                <p className="addshop-error-message">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="addshop-form-group">
              <label htmlFor="address">
                Address <span className="addshop-required-star">*</span>
              </label>
              <div className="addshop-input-container">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="addshop-input-icon addshop-textarea-icon"
                />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter shop address"
                  rows="4"
                  className={
                    touchedFields.address
                      ? validationErrors.address
                        ? "addshop-input-error"
                        : "addshop-input-valid"
                      : ""
                  }
                />
              </div>
              {validationErrors.address && (
                <p className="addshop-error-message">
                  {validationErrors.address}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render success message
  const renderSuccessMessage = () => (
    <div className="addshop-success-container">
      <div className="addshop-success-icon">
        <svg
          className="addshop-checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="addshop-checkmark-circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="addshop-checkmark-check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
      <h3>Shop Added Successfully!</h3>
      <p>The new shop has been added to your system.</p>
      <button
        type="button"
        className="addshop-btn-primary"
        onClick={() => setShowSuccess(false)}
      >
        Add Another Shop
      </button>
    </div>
  );

  return (
    <div className="addshop-container">
      <HeadBar />
      <SalesNav />
      <div className="addshop-content-wrapper">
        <div className="addshop-form-card">
          {!showSuccess ? (
            <>
              <div className="addshop-form-header">
                <h2 className="addshop-form-title">Add New Shop</h2>
                <div className="addshop-progress-bar-container">
                  <div className="addshop-progress-steps">
                    {[...Array(totalSteps)].map((_, index) => (
                      <div
                        key={index}
                        className={`addshop-step ${
                          currentStep > index + 1
                            ? "addshop-completed"
                            : currentStep === index + 1
                            ? "addshop-active"
                            : ""
                        }`}
                      >
                        {currentStep > index + 1 ? (
                          <span className="addshop-step-check">
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                        ) : (
                          <span className="addshop-step-number">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="addshop-progress-line">
                    <div
                      className="addshop-progress-line-inner"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <form className="addshop-form" onSubmit={handleSubmit}>
                <div className="addshop-form-step-wrapper">
                  {renderFormStep()}

                  <div className="addshop-form-actions">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        className="addshop-btn-secondary"
                        onClick={handlePrevious}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} /> Previous
                      </button>
                    )}

                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        className="addshop-btn-primary"
                        onClick={handleNext}
                      >
                        Next <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    ) : (
                      <div className="addshop-final-buttons">
                        <button
                          type="submit"
                          className="addshop-btn-submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="addshop-loader"></span>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faCheck} /> Submit
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {error && (
                <div className="addshop-toast addshop-error addshop-show">
                  {error}
                </div>
              )}
            </>
          ) : (
            renderSuccessMessage()
          )}
        </div>
      </div>
    </div>
  );
}

export default AddShop;
