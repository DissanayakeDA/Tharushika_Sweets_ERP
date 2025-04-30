import StockChangeRequest from "../models/stockChangeRequest.model.js";
import Stock from "../models/stock.model.js";

// Create a new stock change request
export const createStockChangeRequest = async (req, res) => {
  const { stock_id, request_type, proposed_changes, reason, created_by } =
    req.body;

  if (!stock_id || !request_type || !reason || !created_by) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: stock_id, request_type, reason, or created_by",
    });
  }

  if (!["update", "delete"].includes(request_type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request_type. Must be 'update' or 'delete'",
    });
  }

  try {
    const stock = await Stock.findById(stock_id);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock item not found",
      });
    }

    if (
      request_type === "update" &&
      (!proposed_changes || typeof proposed_changes !== "object")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "For update requests, proposed_changes must be provided as an object",
      });
    }

    if (request_type === "delete" && proposed_changes) {
      return res.status(400).json({
        success: false,
        message: "For delete requests, proposed_changes should not be provided",
      });
    }

    const newRequest = new StockChangeRequest({
      stock_id,
      request_type,
      proposed_changes: request_type === "update" ? proposed_changes : null,
      reason,
      created_by,
    });

    await newRequest.save();
    res.status(201).json({
      success: true,
      message: "Stock change request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating stock change request:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};

// Get all pending stock change requests
export const getAllPendingStockChangeRequests = async (req, res) => {
  try {
    const pendingRequests = await StockChangeRequest.find({
      status: "Pending",
    });
    res.status(200).json({
      success: true,
      data: pendingRequests,
    });
  } catch (error) {
    console.error(
      "Error fetching pending stock change requests:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get stock change requests by user
export const getUserStockChangeRequests = async (req, res) => {
  const { created_by } = req.query;

  if (!created_by) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: created_by",
    });
  }

  try {
    const userRequests = await StockChangeRequest.find({ created_by });
    res.status(200).json({
      success: true,
      data: userRequests,
    });
  } catch (error) {
    console.error("Error fetching user stock change requests:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update stock change request status
export const updateStockChangeRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reviewed_by } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be 'Approved' or 'Rejected'",
    });
  }

  if (!reviewed_by) {
    return res.status(400).json({
      success: false,
      message: "Missing required field: reviewed_by",
    });
  }

  try {
    const request = await StockChangeRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Stock change request not found",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot update status of a non-pending request",
      });
    }

    if (status === "Approved") {
      if (request.request_type === "update") {
        await Stock.findByIdAndUpdate(
          request.stock_id,
          { $set: request.proposed_changes },
          { new: true, runValidators: true }
        );
      } else if (request.request_type === "delete") {
        await Stock.findByIdAndDelete(request.stock_id);
      }
    }

    request.status = status;
    request.reviewed_by = reviewed_by;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Stock change request ${status.toLowerCase()} successfully`,
      data: request,
    });
  } catch (error) {
    console.error("Error updating stock change request status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to apply changes: " + error.message,
    });
  }
};

// Delete a stock change request
export const deleteStockChangeRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await StockChangeRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: "Stock change request not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Stock change request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting stock change request:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
