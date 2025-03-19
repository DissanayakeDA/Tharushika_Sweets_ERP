//stock.route.js
import express from "express";
import {
  addStock,
  deleteStock,
  getAllStock,
  getStockById,
  updateStock,
} from "../controllers/stock.controller.js";

const router = express.Router();

router.post("/", addStock);
router.get("/:id", getStockById);
router.put("/:id", updateStock);
router.get("/", getAllStock);
router.delete("/:id", deleteStock);

export default router;
