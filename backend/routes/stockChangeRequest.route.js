import express from "express";
import {
  createStockChangeRequest,
  getAllPendingStockChangeRequests,
  getUserStockChangeRequests,
  updateStockChangeRequestStatus,
  deleteStockChangeRequest,
} from "../controllers/stockChangeRequest.controller.js";

const router = express.Router();

router.post("/", createStockChangeRequest);
router.get("/pending", getAllPendingStockChangeRequests);
router.get("/my-requests", getUserStockChangeRequests);
router.put("/:id/status", updateStockChangeRequestStatus);
router.delete("/:id", deleteStockChangeRequest);

export default router;
