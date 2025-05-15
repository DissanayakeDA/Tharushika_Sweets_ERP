import express from "express";
import {
  createStockRequest,
  getAllStockRequests,
  getUserStockRequests,
  deleteStockRequest,
  updateStockRequestStatus,
} from "../controllers/stockRequest.controller.js";

const router = express.Router();

// Generate a memorable request ID (e.g., REQ-2025-0001)
const generateRequestId = async () => {
  const year = new Date().getFullYear();
  const count = await StockRequest.countDocuments({
    request_id: new RegExp(`^REQ-${year}-`),
  });
  const paddedCount = String(count + 1).padStart(4, "0");
  return `REQ-${year}-${paddedCount}`;
};

// Create a new stock request
router.post("/", createStockRequest);
router.get("/", getAllStockRequests);
router.get("/my-requests", getUserStockRequests);
router.delete("/:id", deleteStockRequest);
router.put("/:id/status", updateStockRequestStatus);

export default router;
