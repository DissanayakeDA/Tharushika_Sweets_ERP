import Stock from "../models/stock.model.js";
import mongoose from "mongoose";

// Add Stock to System
export const addStock = async (req, res) => {
  // console.log("Received Request Body:", req.body); // Log the request data

  const { product_name, product_quantity, product_price } = req.body;

  if (!product_name || product_quantity == null) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    let stock = await Stock.findOne({ product_name });

    if (stock) {
      stock.product_quantity += product_quantity;
      await stock.save();
      return res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        data: stock,
      });
    }

    const newStock = new Stock({
      product_name,
      product_quantity,
      product_price: product_price || 0, // Ensure price is set
    });

    await newStock.save();
    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: newStock,
    });
  } catch (error) {
    console.error("Error in adding/updating stock:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//update stock
export const updateStock = async (req, res) => {
  const { id } = req.params;
  const stock = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid stock ID" });
  }

  try {
    await Stock.findByIdAndUpdate(id, stock, { new: true });
    res.status(200).json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.log("error in updating stock", error);
    res.status(404).json({ success: false, message: "Product not found" });
  }
};

// Get All Stocks
export const getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.status(200).json({ success: true, data: stocks });
  } catch (error) {
    console.log("error in fetching stocks", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get stock by ID
export const getStockById = async (req, res) => {
  const { id } = req.params;

  try {
    const stock = await Stock.findById(id);
    res.status(200).json({ success: true, data: stock });
  } catch (error) {
    console.log("error in fetching stock", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Stock

// Delete stock
export const deleteStock = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product ID" });
  }

  try {
    await Stock.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Stock Deleted" });
  } catch (error) {
    console.log("error in deleting stock", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
