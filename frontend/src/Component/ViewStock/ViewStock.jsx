import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import "./ViewStock.css";
import HeadBar from "../HeadBar/HeadBar";
import { Pencil, Trash2, RefreshCw, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ViewStock() {
  const [selection, setSelection] = useState("products"); // Changed default to products
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData().then(() => {
      setTimeout(() => setIsRefreshing(false), 700);
    });
  };

  const handleSort = (field) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);

    const sortedData = [...data].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (typeof valueA === "string") {
        return newDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return newDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    setData(sortedData);
  };

  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const handleEdit = (item) => {
    // Navigate to the stock change request form with the item ID
    if (selection === "products") {
      navigate(`/mystock-request/${item._id}`);
    } else {
      navigate(`/myingredient-request/${item._id}`);
    }
  };

  const handleDelete = async (item) => {
    const itemType = selection === "products" ? "stock item" : "ingredient";
    const endpointType = selection === "products" ? "stock" : "ingredient";

    if (
      window.confirm(
        `Are you sure you want to request deletion of this ${itemType}?`
      )
    ) {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));

        const response = await axios.post(
          "http://localhost:5000/api/stock-change-requests",
          {
            [`${endpointType}_id`]: item._id,
            request_type: "delete",
            reason: `Requested deletion of ${itemType} via stock view`,
            created_by: user.username,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          alert(
            `Delete request for ${itemType} submitted successfully! Awaiting GM approval.`
          );
          fetchData();
        }
      } catch (error) {
        console.error(`Error submitting ${itemType} delete request:`, error);
        alert(
          `Failed to submit ${itemType} delete request: ${
            error.response ? error.response.data.message : error.message
          }`
        );
      }
    }
  };

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    if (selection === "ingredients") {
      return (
        item.supplier_name?.toLowerCase().includes(searchLower) ||
        item.invoice_id?.toLowerCase().includes(searchLower) ||
        item.ingredient_name?.toLowerCase().includes(searchLower)
      );
    } else {
      return item.product_name?.toLowerCase().includes(searchLower);
    }
  });

  return (
    <div className="VS-main-container">
      <Nav />
      <HeadBar />
      <div className="VS-container">
        <div className="VS-header">
          <h2 className="VS-title">View Stock</h2>

          <div className="VS-controls">
            <div className="VS-search-container">
              <Search size={18} className="VS-search-icon" />
              <input
                type="text"
                placeholder={`Search ${
                  selection === "products" ? "products" : "ingredients"
                }...`}
                className="VS-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="VS-select-container">
              <label htmlFor="stock-type" className="VS-select-label">
                Stock Type:{" "}
              </label>
              <select
                id="stock-type"
                className="VS-select"
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
              >
                <option value="products">Products</option>
                <option value="ingredients">Ingredients</option>
              </select>
            </div>

            <button
              className={`VS-refresh-button ${
                isRefreshing ? "VS-refreshing" : ""
              }`}
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh data"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="VS-loading">
            <div className="VS-spinner"></div>
          </div>
        )}

        {error && <div className="VS-error">{error}</div>}

        <div className="VS-table-container">
          <table className="VS-table">
            <thead>
              <tr>
                {selection === "ingredients" ? (
                  <>
                    <th
                      onClick={() => handleSort("supplier_name")}
                      className="VS-sortable-header"
                    >
                      Supplier {getSortIndicator("supplier_name")}
                    </th>
                    <th
                      onClick={() => handleSort("invoice_id")}
                      className="VS-sortable-header"
                    >
                      Invoice ID {getSortIndicator("invoice_id")}
                    </th>
                    <th
                      onClick={() => handleSort("ingredient_name")}
                      className="VS-sortable-header"
                    >
                      Ingredient Name {getSortIndicator("ingredient_name")}
                    </th>
                    <th
                      onClick={() => handleSort("ingredient_quantity")}
                      className="VS-sortable-header"
                    >
                      Quantity {getSortIndicator("ingredient_quantity")}
                    </th>
                    <th
                      onClick={() => handleSort("lot_price")}
                      className="VS-sortable-header"
                    >
                      Lot Price {getSortIndicator("lot_price")}
                    </th>
                    <th className="VS-action-header">Action</th>
                  </>
                ) : (
                  <>
                    <th
                      onClick={() => handleSort("product_name")}
                      className="VS-sortable-header"
                    >
                      Product Name {getSortIndicator("product_name")}
                    </th>
                    <th
                      onClick={() => handleSort("product_quantity")}
                      className="VS-sortable-header"
                    >
                      Quantity {getSortIndicator("product_quantity")}
                    </th>
                    <th
                      onClick={() => handleSort("product_price")}
                      className="VS-sortable-header"
                    >
                      Price {getSortIndicator("product_price")}
                    </th>
                    <th className="VS-action-header">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={selection === "ingredients" ? 6 : 4}
                    className="VS-no-data"
                  >
                    {searchTerm
                      ? "No matching data found"
                      : "No data available"}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="VS-data-row">
                    {selection === "ingredients" ? (
                      <>
                        <td className="VS-cell">{item.supplier_name}</td>
                        <td className="VS-cell">{item.invoice_id}</td>
                        <td className="VS-cell">{item.ingredient_name}</td>
                        <td className="VS-cell">{item.ingredient_quantity}</td>
                        <td className="VS-price-cell">
                          ${parseFloat(item.lot_price).toFixed(2)}
                        </td>
                        <td className="VS-action-cell">
                          <div className="VS-action-icons">
                            <button
                              className="VS-edit-btn"
                              title="Edit"
                              onClick={() => handleEdit(item)}
                              aria-label="Edit item"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              className="VS-delete-btn"
                              title="Delete"
                              onClick={() => handleDelete(item)}
                              aria-label="Delete item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="VS-cell">{item.product_name}</td>
                        <td className="VS-cell">{item.product_quantity}</td>
                        <td className="VS-price-cell">
                          ${parseFloat(item.product_price).toFixed(2)}
                        </td>
                        <td className="VS-action-cell">
                          <div className="VS-action-icons">
                            <button
                              className="VS-edit-btn"
                              title="Edit"
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              className="VS-delete-btn"
                              title="Delete"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 size={18} />
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
  );
}

export default ViewStock;
