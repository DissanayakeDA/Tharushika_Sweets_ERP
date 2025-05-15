import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PMViewProducts.css";
import PMNav from "../PMNav/PMNav";
import HeadBar from "../HeadBar/HeadBar";

function PMViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch all stocks first
        const stocksRes = await axios.get("http://localhost:5000/api/stocks");
        const stocksData = stocksRes.data.data || [];
        console.log("StocksData:", stocksData);
        // Create maps for product_id and product_name
        const stockIdMap = {};
        const stockNameMap = {};
        stocksData.forEach(stock => {
          if (stock.product_id) stockIdMap[stock.product_id] = stock.product_quantity;
          if (stock.product_name) stockNameMap[stock.product_name.trim().toLowerCase()] = stock.product_quantity;
        });
        console.log("stockIdMap:", stockIdMap);
        console.log("stockNameMap:", stockNameMap);

        // Fetch products
        const productsRes = await axios.get("http://localhost:5000/api/products");
        const productsData = productsRes.data.data || [];
        console.log("ProductsData:", productsData);

        // Combine product data with stock information
        const productsWithStock = productsData.map(product => {
          let available_stock = 0;
          // Try to match by product_id
          if (stockIdMap[product._id]) {
            available_stock = stockIdMap[product._id];
          } else if (stockNameMap[product.product_name.trim().toLowerCase()]) {
            // Fallback: match by product_name
            available_stock = stockNameMap[product.product_name.trim().toLowerCase()];
          }
          return {
            ...product,
            available_stock
          };
        });
        console.log("productsWithStock:", productsWithStock);
        setProducts(productsWithStock);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pm-view-products-container">
      <HeadBar />
      <PMNav />
      
      <div className="pm-view-products-content">
        <div className="pm-view-products-header">
          <h2 className="pm-view-products-title">Product List</h2>
          <div className="pm-view-products-search">
            <input
              type="text"
              placeholder="Search by product name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pm-view-products-search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="pm-view-products-loading">
            <div className="pm-view-products-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="pm-view-products-error">{error}</div>
        ) : (
          <div className="pm-view-products-table-container">
            <table className="pm-view-products-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Available Stock</th>
                  <th>Price (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.product_name}</td>
                      <td className={`stock-quantity ${product.available_stock < 10 ? 'low-stock' : ''}`}>
                        {product.available_stock}
                        {product.available_stock < 10 && (
                          <span className="low-stock-warning">Low Stock</span>
                        )}
                      </td>
                      <td>{product.product_price.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-products">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PMViewProducts; 