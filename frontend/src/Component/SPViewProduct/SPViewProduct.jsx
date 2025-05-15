import React, { useEffect, useState } from "react";
import "./SPviewProduct.css"; // Added styling
import SalesNav from "../SalesNav/SalesNav";
import HeadBar from "../HeadBar/HeadBar";
function SPviewproducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [productToUpdate, setProductToUpdate] = useState(null);

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

  // Open the add product modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Close the add product modal and reset the form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewProduct({ name: "", price: "" });
  };

  // Handle form submission for adding a new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productToAdd = {
      product_name: newProduct.name,
      product_price: parseFloat(newProduct.price),
    };

    // Validate price
    if (isNaN(productToAdd.product_price) || productToAdd.product_price < 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToAdd),
      });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([...products, addedProduct.data]);
        handleCloseModal();
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle deleting a product
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Open the update modal with the selected product's data
  const handleUpdate = (id) => {
    const product = products.find((p) => p._id === id);
    setProductToUpdate(product);
    setIsUpdateModalOpen(true);
  };

  // Handle form submission for updating a product
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      product_name: productToUpdate.product_name,
      product_price: parseFloat(productToUpdate.product_price),
    };

    // Validate price
    if (
      isNaN(updatedProduct.product_price) ||
      updatedProduct.product_price < 0
    ) {
      alert("Please enter a valid price");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productToUpdate._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (response.ok) {
        setProducts(
          products.map((p) =>
            p._id === productToUpdate._id ? { ...p, ...updatedProduct } : p
          )
        );
        setIsUpdateModalOpen(false);
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div>
      <SalesNav />
      <HeadBar />
      <div className="viewDB-buyers-container">
        <div className="viewDB-table-container">
          <table className="viewDB-buyers-table">
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
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No products added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SPviewproducts;
