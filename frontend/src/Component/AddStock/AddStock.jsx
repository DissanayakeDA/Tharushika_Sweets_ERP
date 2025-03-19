import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./AddStock.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeadBar from "../HeadBar/HeadBar";

function AddStock() {
  const [selection, setSelection] = useState("addProducts");
  const [rows, setRows] = useState([
    { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 },
  ]);
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/products");
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError("Failed to fetch product data.");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setError("Error fetching product data.");
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stocks");
      if (response.data.success) {
        setStocks(response.data.data);
      } else {
        setError("Failed to fetch stock data.");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError("Error fetching stock data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/suppliers");
      if (response.data.success) {
        setSuppliers(response.data.data);
      } else {
        setError("Failed to fetch supplier data.");
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      setError("Error fetching supplier data.");
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchStockData();
    fetchSuppliers();
  }, []);

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
    setRows([
      selection === "addProducts"
        ? { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 }
        : {
            supplier: "",
            invoiceId: "",
            ingredientName: "",
            quantity: "",
            lotPrice: "",
          },
    ]);
  };

  const handleItemChange = (index, value) => {
    const product = products.find((item) => item.product_name === value);
    const stock = stocks.find((item) => item.product_name === value);
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      selectedItem: value,
      currentStock: stock ? stock.product_quantity : 0,
      price: product ? product.product_price : 0,
      quantity: 1,
      total: product ? product.product_price * 1 : 0,
    };
    setRows(updatedRows);
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    const newQuantity = parseInt(value, 10) || 1; // Default to 1 if invalid
    if (newQuantity >= 1) {
      updatedRows[index].quantity = newQuantity;
      updatedRows[index].total = newQuantity * updatedRows[index].price;
    }
    setRows(updatedRows);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addNewRow = () => {
    setRows([
      ...rows,
      selection === "addProducts"
        ? { selectedItem: "", currentStock: 0, price: 0, quantity: 1, total: 0 }
        : {
            supplier: "",
            invoiceId: "",
            ingredientName: "",
            quantity: "",
            lotPrice: "",
          },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, rowIndex) => rowIndex !== index));
    }
  };

  const addStockbtn = async () => {
    if (selection === "addProducts") {
      const filteredRows = rows.filter((row) => row.selectedItem);
      if (filteredRows.length === 0) {
        alert("Please select at least one product.");
        return;
      }

      try {
        for (const row of filteredRows) {
          await axios.post("http://localhost:5000/api/stocks", {
            product_name: row.selectedItem,
            product_quantity: row.quantity,
            product_price: row.price || 0, // Ensure price is sent, default to 0 if undefined
          });
        }
        alert("Stock updated successfully!");
        navigate("/viewstock");
      } catch (error) {
        console.error(
          "Error updating stock:",
          error.response ? error.response.data : error.message
        );
        alert(
          `Failed to update stock: ${
            error.response ? error.response.data.message : error.message
          }`
        );
      }
    } else {
      const filteredRows = rows.filter((row) => row.ingredientName);
      if (filteredRows.length === 0) {
        alert("Please add at least one ingredient.");
        return;
      }

      try {
        for (const row of filteredRows) {
          await axios.post("http://localhost:5000/api/ingredients", {
            supplier_name: row.supplier,
            invoice_id: row.invoiceId,
            ingredient_name: row.ingredientName,
            ingredient_quantity: row.quantity,
            lot_price: row.lotPrice,
          });
        }
        alert("Ingredients added successfully!");
        navigate("/viewstock");
      } catch (error) {
        console.error("Error adding ingredients:", error);
        alert("Failed to add ingredients.");
      }
    }
  };

  return (
    <div className="add-stock-container">
      <HeadBar />
      <Nav />
      <h2 className="title-stock">Add Stock</h2>

      <label>Select Stock Type: </label>
      <select
        className="selection-stock"
        value={selection}
        onChange={handleSelectionChange}
      >
        <option value="addProducts">Add Products</option>
        <option value="addIngredients">Add Ingredients</option>
      </select>

      {loading && <p>Loading stock data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="issue-items-table">
        <thead>
          <tr>
            {selection === "addProducts" ? (
              <>
                <th>Item</th>
                <th>Current Stock</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </>
            ) : (
              <>
                <th>Supplier</th>
                <th>Invoice ID</th>
                <th>Ingredient Name</th>
                <th>Quantity</th>
                <th>Lot Price</th>
                <th></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {selection === "addProducts" ? (
                <>
                  <td>
                    <select
                      value={row.selectedItem}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                    >
                      <option value="">Select Item</option>
                      {products.map((item, i) => (
                        <option key={i} value={item.product_name}>
                          {item.product_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{row.currentStock}</td>
                  <td>{row.price}</td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      min="1"
                    />
                  </td>
                  <td>{row.total}</td>
                </>
              ) : (
                <>
                  <td>
                    <select
                      value={row.supplier}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "supplier",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((sup, i) => (
                        <option key={i} value={sup.supplier_name}>
                          {sup.supplier_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.invoiceId}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "invoiceId",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.ingredientName}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "ingredientName",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="stock-qty-input"
                      type="number"
                      value={row.lotPrice}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "lotPrice",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </>
              )}
              <td>
                <button
                  className="remove-row-btn"
                  onClick={() => removeRow(index)}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className="add-row-btn-stock" onClick={addNewRow}>
          +
        </button>
        <button className="addstock-btn" onClick={addStockbtn}>
          Add Stock
        </button>
      </div>
    </div>
  );
}

export default AddStock;
