import SalesRequest from "../models/salesRequest.model.js";
import Stock from "../models/stock.model.js";

// Create a new sales request
export const createSalesRequest = async (req, res) => {
  const { product_name, requested_quantity, created_by } = req.body;

  if (!product_name || !requested_quantity || !created_by) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: product_name, requested_quantity, or created_by",
    });
  }

  try {
    const stock = await Stock.findOne({ product_name });
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Product not found in stock",
      });
    }
    if (stock.product_quantity < requested_quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock quantity",
      });
    }

    const newSalesRequest = new SalesRequest({
      product_name,
      requested_quantity,
      created_by,
    });

    await newSalesRequest.save();
    res.status(201).json({
      success: true,
      message: "Sales request created successfully",
      data: newSalesRequest,
    });
  } catch (error) {
    console.error("Error creating sales request:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// Get all sales requests
export const getAllSalesRequests = async (req, res) => {
  try {
    const salesRequests = await SalesRequest.find({});
    res.status(200).json({
      success: true,
      data: salesRequests,
    });
  } catch (error) {
    console.error("Error fetching sales requests:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get sales requests by user
export const getUserSalesRequests = async (req, res) => {
  const { created_by } = req.query; // Expect created_by as a query parameter

  if (!created_by) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: created_by",
    });
  }

  try {
    const salesRequests = await SalesRequest.find({ created_by });
    res.status(200).json({
      success: true,
      data: salesRequests,
    });
  } catch (error) {
    console.error("Error fetching user sales requests:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete a sales request
export const deleteSalesRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await SalesRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Sales request not found",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be deleted",
      });
    }

    await SalesRequest.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Sales request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sales request:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update sales request status (approve/reject)
export const updateSalesRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be 'Approved' or 'Rejected'",
    });
  }

  try {
    const updatedRequest = await SalesRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Sales request not found",
      });
    }

    // If approved, reduce stock quantity
    if (status === "Approved") {
      const stock = await Stock.findOne({
        product_name: updatedRequest.product_name,
      });
      if (stock) {
        stock.product_quantity -= updatedRequest.requested_quantity;
        await stock.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Sales request ${status.toLowerCase()} successfully`,
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating sales request status:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
