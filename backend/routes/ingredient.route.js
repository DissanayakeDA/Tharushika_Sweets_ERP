import express from "express";
import {
  addIngredient,
  deleteIngredient,
  getAllIngredient,
  getIngredientById,
} from "../controllers/ingredient.controller.js";

const router = express.Router();

router.post("/", addIngredient);
router.get("/:id", getIngredientById);
router.get("/", getAllIngredient);
router.delete("/:id", deleteIngredient);

export default router;
