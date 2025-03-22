import SalesRequest from "../models/salesRequest.model.js";
import Stock from "../models/stock.model.js";
import mongoose from "mongoose";

// Create a new sales request
export const createSalesRequest = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid sales request: Please provide an array of items",
    });
  }

  try {
    for (const item of items) {
      const { product_name, quantity } = item;
      if (!product_name || !quantity || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid item: Missing or invalid product_name or quantity",
        });
      }

      const stock = await Stock.findOne({ product_name });
      if (!stock || stock.product_quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product_name}. Available: ${stock?.product_quantity || 0}, Requested: ${quantity}`,
        });
      }
    }

    const salesRequest = new SalesRequest({ items });
    await salesRequest.save();

    res.status(201).json({
      success: true,
      message: "Sales request created successfully",
      data: salesRequest,
    });
  } catch (error) {
    console.error("Error creating sales request:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// Get all sales requests
export const getAllSalesRequests = async (req, res) => {
  try {
    const salesRequests = await SalesRequest.find().sort({ requestedAt: -1 });
    res.status(200).json({ success: true, data: salesRequests });
  } catch (error) {
    console.error("Error fetching sales requests:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update sales request status (accept or reject)
export const updateSalesRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid request ID" });
  }

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const salesRequest = await SalesRequest.findById(id);
    if (!salesRequest) {
      return res.status(404).json({ success: false, message: "Sales request not found" });
    }

    if (salesRequest.status !== "pending") {
      return res.status(400).json({ success: false, message: "Request already processed" });
    }

    salesRequest.status = status;
    salesRequest.processedAt = Date.now();

    if (status === "accepted") {
      for (const item of salesRequest.items) {
        const stock = await Stock.findOne({ product_name: item.product_name });
        if (stock) {
          stock.product_quantity -= item.quantity;
          await stock.save();
        }
      }
    }

    await salesRequest.save();
    res.status(200).json({
      success: true,
      message: `Sales request ${status} successfully`,
      data: salesRequest,
    });
  } catch (error) {
    console.error("Error updating sales request:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};