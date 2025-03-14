import express from "express";
import {
  addStock,
  deleteStock,
  getAllStock,
  getStockById,
} from "../controllers/stock.controller.js";

const router = express.Router();

router.post("/", addStock);
router.get("/:id", getStockById);
router.get("/", getAllStock);
router.delete("/:id", deleteStock);

export default router;
