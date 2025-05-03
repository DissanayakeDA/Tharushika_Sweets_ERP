import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeadBar from "../HeadBar/HeadBar";
import "./AddStock.css";
import {
  FaPlus,
  FaMinus,
  FaBoxOpen,
  FaLeaf,
  FaSpinner,
  FaSearch,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    setSearchTerm("");
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

    // Provide feedback
    toast.info(`Selected ${value}`, { autoClose: 1500 });
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

    // Provide feedback for important fields
    if (field === "supplier" && value) {
      toast.info(`Selected supplier: ${value}`, { autoClose: 1500 });
    }
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
    toast.success("New row added!", { autoClose: 1500 });
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const rowToRemove = rows[index];
      const confirmMessage =
        selection === "addProducts"
          ? `Remove ${rowToRemove.selectedItem || "this item"}?`
          : `Remove ${rowToRemove.ingredientName || "this ingredient"}?`;

      if (window.confirm(confirmMessage)) {
        setRows(rows.filter((_, rowIndex) => rowIndex !== index));
        toast.info("Row removed", { autoClose: 1500 });
      }
    } else {
      toast.warning("Cannot remove the last row", { autoClose: 2000 });
    }
  };

  const validateForm = () => {
    if (selection === "addProducts") {
      return rows.some((row) => row.selectedItem && row.quantity > 0);
    } else {
      return rows.some(
        (row) => row.supplier && row.ingredientName && row.quantity
      );
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error(
        selection === "addProducts"
          ? "Please select at least one product with a valid quantity."
          : "Please add at least one ingredient with supplier and quantity."
      );
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      if (selection === "addProducts") {
        const filteredRows = rows.filter((row) => row.selectedItem);

        for (const row of filteredRows) {
          await axios.post("http://localhost:5000/api/stocks", {
            product_name: row.selectedItem,
            product_quantity: row.quantity,
            product_price: row.price || 0,
          });
        }
        toast.success("Stock updated successfully!");
      } else {
        const filteredRows = rows.filter((row) => row.ingredientName);

        for (const row of filteredRows) {
          await axios.post("http://localhost:5000/api/ingredients", {
            supplier_name: row.supplier,
            invoice_id: row.invoiceId,
            ingredient_name: row.ingredientName,
            ingredient_quantity: row.quantity,
            lot_price: row.lotPrice,
          });
        }
        toast.success("Ingredients added successfully!");
      }
      setTimeout(() => navigate("/viewstock"), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Failed: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    } finally {
      setSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const cancelSubmit = () => {
    setShowConfirmation(false);
  };

  // Filter products or suppliers based on search term
  const filteredProducts = searchTerm
    ? products.filter((p) =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const filteredSuppliers = searchTerm
    ? suppliers.filter((s) =>
        s.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : suppliers;

  // Calculate total value for all products
  const totalValue =
    selection === "addProducts"
      ? rows.reduce((sum, row) => sum + row.total, 0)
      : 0;

  return (
    <div className="add-stock-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <HeadBar />
      <Nav />

      <div className="add-stock-content">
        <div className="add-stock-header">
          <h2 className="title-stock">
            {selection === "addProducts" ? (
              <>
                <FaBoxOpen className="header-icon" /> Add Products Stock
              </>
            ) : (
              <>
                <FaLeaf className="header-icon" /> Add Ingredients
              </>
            )}
          </h2>

          <div className="selection-container">
            <label htmlFor="stockType">Select Stock Type: </label>
            <select
              id="stockType"
              className="select-type"
              value={selection}
              onChange={handleSelectionChange}
            >
              <option value="addProducts">Add Products</option>
              <option value="addIngredients">Add Ingredients</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <FaSpinner className="spin-icon" /> Loading stock data...
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder={
                    selection === "addProducts"
                      ? "Search products..."
                      : "Search suppliers or ingredients..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="items-count">
                {selection === "addProducts"
                  ? `${filteredProducts.length} products available`
                  : `${filteredSuppliers.length} suppliers available`}
              </div>
            </div>

            <div className="table-container">
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
                        <th>Action</th>
                      </>
                    ) : (
                      <>
                        <th>Supplier</th>
                        <th>Invoice ID</th>
                        <th>Ingredient Name</th>
                        <th>Quantity</th>
                        <th>Lot Price</th>
                        <th>Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={index}
                      className={`data-row ${
                        row.selectedItem || row.ingredientName
                          ? "selected-row"
                          : ""
                      }`}
                    >
                      {selection === "addProducts" ? (
                        <>
                          <td>
                            <select
                              className="select-item"
                              value={row.selectedItem}
                              onChange={(e) =>
                                handleItemChange(index, e.target.value)
                              }
                            >
                              <option value="">Select Item</option>
                              {filteredProducts.map((item, i) => (
                                <option key={i} value={item.product_name}>
                                  {item.product_name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="stock-value">
                            {row.currentStock > 0 ? row.currentStock : "-"}
                          </td>
                          <td className="price-value">
                            ${row.price > 0 ? row.price.toFixed(2) : "0.00"}
                          </td>
                          <td>
                            <div className="quantity-control">
                              <button
                                className="quantity-btn decrease"
                                onClick={() =>
                                  handleQuantityChange(
                                    index,
                                    Math.max(1, row.quantity - 1)
                                  )
                                }
                                disabled={row.quantity <= 1}
                              >
                                -
                              </button>
                              <input
                                className="quantity-input"
                                type="number"
                                value={row.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(index, e.target.value)
                                }
                                min="1"
                              />
                              <button
                                className="quantity-btn increase"
                                onClick={() =>
                                  handleQuantityChange(index, row.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="total-value">
                            ${row.total > 0 ? row.total.toFixed(2) : "0.00"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <select
                              className="select-item"
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
                              {filteredSuppliers.map((sup, i) => (
                                <option key={i} value={sup.supplier_name}>
                                  {sup.supplier_name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              className="text-input"
                              type="text"
                              value={row.invoiceId}
                              placeholder="Invoice #"
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
                              className="text-input"
                              type="text"
                              placeholder="Ingredient name"
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
                            <div className="quantity-control">
                              <button
                                className="quantity-btn decrease"
                                onClick={() => {
                                  const currentValue =
                                    parseInt(row.quantity) || 0;
                                  handleIngredientChange(
                                    index,
                                    "quantity",
                                    Math.max(1, currentValue - 1).toString()
                                  );
                                }}
                                disabled={
                                  !row.quantity || parseInt(row.quantity) <= 1
                                }
                              >
                                -
                              </button>
                              <input
                                className="quantity-input"
                                type="number"
                                placeholder="Qty"
                                value={row.quantity}
                                onChange={(e) =>
                                  handleIngredientChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                              <button
                                className="quantity-btn increase"
                                onClick={() => {
                                  const currentValue =
                                    parseInt(row.quantity) || 0;
                                  handleIngredientChange(
                                    index,
                                    "quantity",
                                    (currentValue + 1).toString()
                                  );
                                }}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className="price-input-wrapper">
                              <span className="currency-symbol">$</span>
                              <input
                                className="stock-qty-input"
                                type="number"
                                placeholder="Price"
                                value={row.lotPrice}
                                onChange={(e) =>
                                  handleIngredientChange(
                                    index,
                                    "lotPrice",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </td>
                        </>
                      )}
                      <td>
                        <button
                          className="remove-row-btn"
                          onClick={() => removeRow(index)}
                          title="Remove row"
                        >
                          <FaMinus />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {selection === "addProducts" && totalValue > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="total-label">
                        Total Value:
                      </td>
                      <td className="grand-total">${totalValue.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <div className="button-container">
              <button
                className="add-row-btn-stock"
                onClick={addNewRow}
                title="Add new row"
              >
                <FaPlus />
              </button>
              <button
                className={`addstock-btn ${
                  validateForm() ? "active" : "disabled"
                }`}
                onClick={handleSubmit}
                disabled={!validateForm() || submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="spin-icon" /> Processing...
                  </>
                ) : selection === "addProducts" ? (
                  "Add Stock"
                ) : (
                  "Add Ingredients"
                )}
              </button>
            </div>

            {/* Summary section */}
            {rows.some((row) => row.selectedItem || row.ingredientName) && (
              <div className="summary-panel">
                <h3>Summary</h3>
                <div className="summary-content">
                  {selection === "addProducts" ? (
                    <>
                      <p>
                        <strong>Products to add:</strong>{" "}
                        {rows.filter((r) => r.selectedItem).length}
                      </p>
                      <p>
                        <strong>Total items:</strong>{" "}
                        {rows.reduce(
                          (sum, row) =>
                            sum + (row.selectedItem ? row.quantity : 0),
                          0
                        )}
                      </p>
                      <p>
                        <strong>Total value:</strong> ${totalValue.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Ingredients to add:</strong>{" "}
                        {rows.filter((r) => r.ingredientName).length}
                      </p>
                      <p>
                        <strong>Suppliers:</strong>{" "}
                        {
                          new Set(
                            rows
                              .filter((r) => r.supplier)
                              .map((r) => r.supplier)
                          ).size
                        }
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-dialog">
              <h3>
                Confirm{" "}
                {selection === "addProducts"
                  ? "Stock Addition"
                  : "Ingredient Addition"}
              </h3>
              <p>Are you sure you want to proceed?</p>

              <div className="confirmation-summary">
                {selection === "addProducts" ? (
                  <>
                    <p>
                      Adding {rows.filter((r) => r.selectedItem).length}{" "}
                      products
                    </p>
                    <p>
                      Total items:{" "}
                      {rows.reduce(
                        (sum, row) =>
                          sum + (row.selectedItem ? row.quantity : 0),
                        0
                      )}
                    </p>
                    <p>Total value: ${totalValue.toFixed(2)}</p>
                  </>
                ) : (
                  <>
                    <p>
                      Adding {rows.filter((r) => r.ingredientName).length}{" "}
                      ingredients
                    </p>
                    <p>
                      From{" "}
                      {
                        new Set(
                          rows.filter((r) => r.supplier).map((r) => r.supplier)
                        ).size
                      }{" "}
                      suppliers
                    </p>
                  </>
                )}
              </div>

              <div className="confirmation-actions">
                <button
                  className="confirm-btn"
                  onClick={confirmSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="spin-icon" /> Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck /> Confirm
                    </>
                  )}
                </button>
                <button
                  className="cancel-btn"
                  onClick={cancelSubmit}
                  disabled={submitting}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddStock;
