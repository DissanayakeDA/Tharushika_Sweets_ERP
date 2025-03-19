//product route
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import express from "express";

const router = express.Router();

router.post("/", addProduct);
router.get("/:id", getProductById);
router.get("/", getAllProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
