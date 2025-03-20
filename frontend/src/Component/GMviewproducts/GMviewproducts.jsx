import React, { useEffect, useState } from "react";
import "./GMviewproducts.css"; // Added styling
import GMNav from "../GMNav/GMNav";
import HeadBar from "../HeadBar/HeadBar";
function GMviewproducts() {

    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  
    // Fetch all products when the component mounts
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/products");
          if (response.ok) {
            const data = await response.json();
            setProducts(data.data);
          } else {
            console.error("Failed to fetch products");
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts();
    }, []);
  
    
  
    return (
      <div>
        <GMNav />
        <HeadBar/>
        <div className="returns-container">
          <div className="header">
            <h2 className="returns-title">Product Records</h2>
           
          </div>
  
          <div className="table-container">
            <table className="returns-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Product Price</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.product_name}</td>
                      <td>{product.product_price}</td>
                                          </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No products added yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
  
        
      </div>
    );
  }

export default GMviewproducts
