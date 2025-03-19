//product controller
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const addProduct = async (req, res) => {
  const product = req.body;

  if (!product.product_name || !product.product_price) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all details" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in create product", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get All Products
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("error in fetching products", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("error in fetching product", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  try {
    await Product.findByIdAndUpdate(id, product, { new: true });
    res.status(200).json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.log("error in updating product", error);
    res.status(404).json({ success: false, message: "Product not found" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product Deleted" });
  } catch (error) {
    console.log("error in deleting product", error);
    res.status(404).json({ success: false, message: "Product not found" });
  }
};
