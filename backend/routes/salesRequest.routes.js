import express from "express";
import {
  createSalesRequest,
  getAllSalesRequests,
  getUserSalesRequests,
  deleteSalesRequest,
  updateSalesRequestStatus,
} from "../controllers/salesRequest.controller.js";

const router = express.Router();

router.post("/", createSalesRequest);
router.get("/", getAllSalesRequests);
router.get("/my-requests", getUserSalesRequests); // New endpoint for user requests
router.delete("/:id", deleteSalesRequest); // New endpoint for deletion
router.put("/:id/status", updateSalesRequestStatus); // New endpoint for status update

export default router;
