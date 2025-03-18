import Ingredient from "../models/ingredient.model.js";
import mongoose from "mongoose";

// Add Stock to System
export const addIngredient = async (req, res) => {
  const ingredient = req.body;

  if (
    !ingredient.invoice_id ||
    !ingredient.ingredient_name ||
    !ingredient.supplier_name ||
    !ingredient.ingredient_quantity ||
    !ingredient.lot_price
  ) {
    console.log("Missing fields:", ingredient);
    return res
      .status(400)
      .json({ success: false, message: "Please provide all details" });
  }

  const newIngredient = new Ingredient(ingredient);

  try {
    await newIngredient.save();
    res.status(201).json({ success: true, data: newIngredient });
  } catch (error) {
    console.error("Error in create stock", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get All Stocks
export const getAllIngredient = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    console.log("error in fetching stocks", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get stock by ID
export const getIngredientById = async (req, res) => {
  const { id } = req.params;

  try {
    const ingredient = await Ingredient.findById(id);
    res.status(200).json({ success: true, data: ingredient });
  } catch (error) {
    console.log("error in fetching stock", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Stock

// Delete stock
export const deleteIngredient = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ingredient ID" });
  }

  try {
    await Ingredient.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Ingredient Deleted" });
  } catch (error) {
    console.log("error in deleting stock", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
