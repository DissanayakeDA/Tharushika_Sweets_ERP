//salesstock.controller.js
import SalesStock from "../models/salesstock.model.js";
import mongoose from "mongoose";

// Add Stock to System
export const addSalesStock = async (req, res) => {
  console.log("Received Request Body:", req.body); // Log the request data for debugging
  const { sp_name, sp_quantity, sp_price } = req.body;

  if (!sp_name || sp_quantity == null) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: product_name or product_quantity",
    });
  }

  try {
    let salesstock = await SalesStock.findOne({ sp_name });

    if (salesstock) {
      salesstock.sp_quantity += Number(sp_quantity); // Ensure quantity is a number
      await salesstock.save();
      return res.status(200).json({
        success: true,
        message: "Stock updated successfully",
        data: salesstock,
      });
    }

    const newSalesStock = new SalesStock({
      sp_name,
      sp_quantity: Number(sp_quantity),
      sp_price: sp_price ? Number(sp_price) : 0, // Convert to number, default to 0
    });

    await newSalesStock.save();
    res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: newSalesStock,
    });
  } catch (error) {
    console.error(
      "Error in adding/updating stock:",
      error.message,
      error.stack
    );
    res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// Update Stock
export const updateSalesStock = async (req, res) => {
  const { id } = req.params;
  const salesstock = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid stock ID" });
  }

  try {
    const updatedSalesStock = await SalesStock.findByIdAndUpdate(
      id,
      salesstock,
      {
        new: true,
      }
    );
    if (!updatedSalesStock) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }
    res.status(200).json({
      success: true,
      message: "Stock updated",
      data: updatedSalesStock,
    });
  } catch (error) {
    console.error("Error in updating stock:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get All Stocks
export const getAllSalesStock = async (req, res) => {
  try {
    const salesstocks = await SalesStock.find({});
    res.status(200).json({ success: true, data: salesstocks });
  } catch (error) {
    console.error("Error in fetching stocks:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get stock by ID
export const getSalesStockById = async (req, res) => {
  const { id } = req.params;

  try {
    const salesstock = await SalesStock.findById(id);
    if (!salesstock) {
      return res
        .status(404)
        .json({ success: false, message: "Stock not found" });
    }
    res.status(200).json({ success: true, data: salesstock });
  } catch (error) {
    console.error("Error in fetching stock:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
