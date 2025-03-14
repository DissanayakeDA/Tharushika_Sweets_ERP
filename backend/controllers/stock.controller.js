import Stock from "../models/stock.model.js";
import mongoose from "mongoose";

// Add Stock to System
export const addStock = async (req, res) => {
  const stock = req.body;

  if (
    !stock.product_id ||
    !stock.product_name ||
    !stock.product_quantity ||
    !stock.product_price
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all details" });
  }

  const newStock = new Stock(stock);

  try {
    await newStock.save();
    res.status(201).json({ success: true, data: newStock });
  } catch (error) {
    console.error("Error in create stock", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
