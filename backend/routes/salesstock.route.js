//salesstock.route.js
//stock.route.js
import express from "express";
import {
  addSalesStock,
  getAllSalesStock,
  getSalesStockById,
  updateSalesStock,
} from "../controllers/salesstock.controller.js";

const router = express.Router();

router.post("/", addSalesStock);
router.get("/:id", getSalesStockById);
router.put("/:id", updateSalesStock);
router.get("/", getAllSalesStock);

export default router;
