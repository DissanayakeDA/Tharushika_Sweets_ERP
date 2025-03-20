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
      <div className="view-stock-container">
        <div className="header">
          <h2 className="view-stock-title">View Stock</h2>

          <label>Select Stock Type: </label>
          <select
          className="stock-select"
            value={selection}
            onChange={(e) => setSelection(e.target.value)}
          >
            <option value="ingredients">Ingredients</option>
            <option value="products">Products</option>
          </select>

          {loading && <p>Loading data...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="table-container">
            <table className="view-stock-table">
              <thead>
                <tr>
                  {selection === "ingredients" ? (
                    <>
                      <th>Supplier</th>
                      <th>Invoice ID</th>
                      <th>Ingredient Name</th>
                      <th>Quantity</th>
                      <th>Lot Price</th>
                      <th>Action</th>
                    </>
                  ) : (
                    <>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
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
                          <td>
                            <div className="action-icons">
                              <button className="action">
                                <i className="bi bi-pencil-square"></i>
                              </button>

                              <button className="action">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{item.product_name}</td>
                          <td>{item.product_quantity}</td>
                          <td>{item.product_price}</td>
                          <td>
                            <div className="action-icons">
                              <button className="action">
                                <i className="bi bi-pencil-square"></i>
                              </button>

                              <button className="action">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
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
    </div>
  );
}

export default GMViewStock;
