import React, { useEffect, useState } from "react";
import "./GMviewproducts.css"; // Added styling
import GMNav from "../GMNav/GMNav";
import HeadBar from "../HeadBar/HeadBar";
function GMviewproducts() {
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
      <GMNav />
      <HeadBar />
      <div className="viewDB-buyers-container">
        <div className="viewDB-header">
          <h2 className="viewDB-buyer-title">Products List</h2>
          <button className="viewDB-new-buyer-btn" onClick={handleOpenModal}>
            + New Product
          </button>
        </div>

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

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="viewDB-popup-overlay" onClick={handleCloseModal}>
          <div
            className="viewDB-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="viewDB-form-title-dbuyers-popup">Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="viewDB-form-group-dbuyers-popup">
                <label className="viewDB-lable-popup" htmlFor="name">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="viewDB-form-group-dbuyers-popup">
                <label className="viewDB-lable-popup" htmlFor="price">
                  Product Price
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  placeholder="Enter product price"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="viewDB-popup-buttons">
                <button type="submit" className="viewDB-save-btn-dbuyers-popup">
                  Add
                </button>
                <button
                  type="button"
                  className="viewDB-cancel-btn-popup"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {isUpdateModalOpen && (
        <div
          className="viewDB-popup-overlay"
          onClick={() => setIsUpdateModalOpen(false)}
        >
          <div
            className="viewDB-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="viewDB-form-title-dbuyers-popup">Update Product</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="viewDB-form-group-dbuyers-popup">
                <label className="viewDB-lable-popup" htmlFor="name">
                  Product Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={productToUpdate.product_name}
                  onChange={(e) =>
                    setProductToUpdate({
                      ...productToUpdate,
                      product_name: e.target.value,
                    })
                  }
                  placeholder="Update product name"
                  required
                />
              </div>
              <div className="viewDB-form-group-dbuyers-popup">
                <label className="viewDB-lable-popup" htmlFor="price">
                  Product Price
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={productToUpdate.product_price}
                  onChange={(e) =>
                    setProductToUpdate({
                      ...productToUpdate,
                      product_price: e.target.value,
                    })
                  }
                  placeholder="Update product price"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GMviewproducts;
