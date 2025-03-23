import Stock from "../models/stock.model.js";
import mongoose from "mongoose";

// Add Stock to System
export const addStock = async (req, res) => {
  console.log("Received Request Body:", req.body);
  const { product_name, product_quantity, product_price } = req.body;

  if (!product_name || product_quantity == null) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Missing required fields: product_name or product_quantity",
      });
  }

  try {
    let stock = await Stock.findOne({ product_name });

    if (stock) {
      stock.product_quantity += Number(product_quantity);
      await stock.save();
      return res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        data: stock,
      });
    }

    const newStock = new Stock({
      product_name,
      product_quantity: Number(product_quantity),
      product_price: product_price ? Number(product_price) : 0,
    });

    await newStock.save();
    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: newStock,
    });
  } catch (error) {
    console.error("Error in adding/updating stock:", error.message, error.stack);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error: " + error.message,
      });
  }
};

// Update Stock
export const updateStock = async (req, res) => {
  const { id } = req.params;
  const stock = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid stock ID" });
  }

  try {
    const updatedStock = await Stock.findByIdAndUpdate(id, stock, {
      new: true,
    });
    if (!updatedStock) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Stock updated", data: updatedStock });
  } catch (error) {
    console.error("Error in updating stock:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get All Stocks
export const getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.find({});
    res.status(200).json({ success: true, data: stocks });
  } catch (error) {
    console.error("Error in fetching stocks:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get stock by ID
export const getStockById = async (req, res) => {
  const { id } = req.params;

  try {
    const stock = await Stock.findById(id);
    if (!stock) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }
    res.status(200).json({ success: true, data: stock });
  } catch (error) {
    console.error("Error in fetching stock:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete stock
export const deleteStock = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Stock ID" });
  }

  try {
    const deletedStock = await Stock.findByIdAndDelete(id);
    if (!deletedStock) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }
    res.status(200).json({ success: true, message: "Stock deleted" });
  } catch (error) {
    console.error("Error in deleting stock:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Deprecated sellStock function
export const sellStock = async (req, res) => {
  return res.status(410).json({
    success: false,
    message: "This endpoint is deprecated. Use /api/sales-requests instead.",
  });
};