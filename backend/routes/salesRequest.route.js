import express from "express";
import {
  createSalesRequest,
  getAllSalesRequests,
  updateSalesRequestStatus,
} from "../controllers/salesRequest.controller.js";

const router = express.Router();

router.post("/", createSalesRequest);
router.get("/", getAllSalesRequests);
router.put("/:id/status", updateSalesRequestStatus);

export default router;