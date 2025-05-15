import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IngredientRequestForm.css";
import PMNav from "../PMNav/PMNav";
import HeadBar from "../HeadBar/HeadBar";

function IngredientRequestForm() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [requestQuantity, setRequestQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const response = await axios.get("http://localhost:5000/api/ingredients", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.status === 200 && response.data.success) {
          setIngredients(response.data.data);
        } else {
          setError("Failed to fetch ingredients.");
        }
      } catch (err) {
        setError("Server error while fetching ingredients.");
        console.error("Error fetching ingredients:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedIngredient || !requestQuantity) {
      setError("Please select an ingredient and specify a quantity.");
      return;
    }

    if (requestQuantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const response = await axios.post(
        "http://localhost:5000/api/ingredient-requests",
        {
          ingredient_id: selectedIngredient,
          request_quantity: parseFloat(requestQuantity),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 201 && response.data.success) {
        setSuccess("Ingredient request submitted successfully!");
        setSelectedIngredient("");
        setRequestQuantity("");
      } else {
        setError("Failed to submit ingredient request.");
      }
    } catch (err) {
      setError("Server error while submitting request.");
      console.error("Error submitting request:", err);
    }
  };

  return (
    <div className="ingredient-request-home-container">
      <HeadBar />
      <div className="ingredient-request-layout">
        <div className="ingredient-request-sidebar">
          <PMNav />
        </div>
        <div className="ingredient-request-main-content">
          <div className="ingredient-request-content-wrapper">
            <h2 className="ingredient-request-title">Request Ingredient</h2>
            {isLoading ? (
              <div className="ingredient-request-loading-spinner">
                <div className="ingredient-request-spinner"></div>
                <p>Loading ingredients...</p>
              </div>
            ) : (
              <div className="ingredient-request-form-container">
                {error && <p className="ingredient-request-error-message">{error}</p>}
                {success && <p className="ingredient-request-success-message">{success}</p>}
                <form onSubmit={handleSubmit} className="ingredient-request-form">
                  <div className="ingredient-request-form-group">
                    <label htmlFor="ingredient" className="ingredient-request-label">
                      Select Ingredient
                    </label>
                    <select
                      id="ingredient"
                      value={selectedIngredient}
                      onChange={(e) => setSelectedIngredient(e.target.value)}
                      className="ingredient-request-select"
                    >
                      <option value="">-- Select an Ingredient --</option>
                      {ingredients.map((ingredient) => (
                        <option key={ingredient._id} value={ingredient._id}>
                          {ingredient.ingredient_name} (Qty: {ingredient.ingredient_quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ingredient-request-form-group">
                    <label htmlFor="quantity" className="ingredient-request-label">
                      Requested Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={requestQuantity}
                      onChange={(e) => setRequestQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      className="ingredient-request-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button type="submit" className="ingredient-request-submit-btn">
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngredientRequestForm;