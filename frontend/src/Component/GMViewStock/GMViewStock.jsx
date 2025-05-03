import React, { useState, useEffect } from "react";
import GMNav from "../GMNav/GMNav";
import axios from "axios";
import "./GMViewStock.css";
import HeadBar from "../HeadBar/HeadBar";

function GMViewStock() {
  const [selection, setSelection] = useState("ingredients");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        selection === "ingredients"
          ? "http://localhost:5000/api/ingredients"
          : "http://localhost:5000/api/stocks";

      const response = await axios.get(endpoint);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selection]);

  return (
    <div>
      <GMNav />
      <HeadBar />
      <div className="viewDB-buyers-container">
        <div className="viewDB-header">
          <h2 className="viewDB-buyer-title">View Stock</h2>
        </div>

        <div className="viewDB-advanced-filters">
          <select
            className="viewDB-filter-input"
            value={selection}
            onChange={(e) => setSelection(e.target.value)}
          >
            <option value="ingredients">Ingredients</option>
            <option value="products">Products</option>
          </select>
        </div>

        {loading && <div className="viewDB-loading">Loading data...</div>}
        {error && <div className="viewDB-error">{error}</div>}

        <div className="viewDB-table-container">
          <table className="viewDB-buyers-table">
            <thead>
              <tr>
                {selection === "ingredients" ? (
                  <>
                    <th>Supplier</th>
                    <th>Invoice ID</th>
                    <th>Ingredient Name</th>
                    <th>Quantity</th>
                    <th>Lot Price</th>
                  </>
                ) : (
                  <>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={selection === "ingredients" ? 6 : 4}
                    style={{ textAlign: "center" }}
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    {selection === "ingredients" ? (
                      <>
                        <td>{item.supplier_name}</td>
                        <td>{item.invoice_id}</td>
                        <td>{item.ingredient_name}</td>
                        <td>{item.ingredient_quantity}</td>
                        <td>{item.lot_price}</td>
                      </>
                    ) : (
                      <>
                        <td>{item.product_name}</td>
                        <td>{item.product_quantity}</td>
                        <td>{item.product_price}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GMViewStock;
