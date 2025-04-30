import express from "express";
import {
  addStock,
  getAllStock,
  getStockById,
  sellStock, // Keeping deprecated endpoint as-is
} from "../controllers/stock.controller.js";

const router = express.Router();

router.post("/", addStock);
router.get("/:id", getStockById);
router.get("/", getAllStock);
router.post("/sell", sellStock); // Deprecated endpoint

// Removed:
// router.put("/:id", updateStock);
// router.delete("/:id", deleteStock);

export default router;
