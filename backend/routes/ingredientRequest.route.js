import express from "express";
import {
  addIngredientRequest,
  updateIngredientRequest,
  getAllIngredientRequests,
  deleteIngredientRequest,
} from "../controllers/ingredientRequest.controller.js";

const router = express.Router();

router.post("/", addIngredientRequest);
router.get("/", getAllIngredientRequests);
router.patch("/:id", updateIngredientRequest);
router.delete("/:id", deleteIngredientRequest);

export default router;
