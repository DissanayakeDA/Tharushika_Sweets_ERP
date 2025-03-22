import express from "express";
import {
  addStock,
  deleteStock,
  getAllStock,
  getStockById,
  updateStock,
  sellStock,
} from "../controllers/stock.controller.js";

const router = express.Router();

router.post("/", addStock);
router.get("/:id", getStockById);
router.put("/:id", updateStock);
router.get("/", getAllStock);
router.delete("/:id", deleteStock);
router.post("/sell", sellStock); // Deprecated endpoint

export default router;