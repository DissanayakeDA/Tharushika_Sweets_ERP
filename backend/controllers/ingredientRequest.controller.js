import IngredientRequest from "../models/ingredientRequest.model.js";
import mongoose from "mongoose";

export const addIngredientRequest = async (req, res) => {
  const { ingredient_id, request_quantity } = req.body;

  if (!ingredient_id || !request_quantity) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all details" });
  }

  const newRequest = new IngredientRequest({
    ingredient_id,
    request_quantity,
    status: "pending",
  });

  try {
    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    console.error("Error in creating ingredient request:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllIngredientRequests = async (req, res) => {
  try {
    const requests = await IngredientRequest.find({}).populate("ingredient_id");
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching ingredient requests:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateIngredientRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request ID" });
  }

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const updatedRequest = await IngredientRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("ingredient_id");
    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error("Error updating ingredient request:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteIngredientRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request ID" });
  }

  try {
    const request = await IngredientRequest.findById(id);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Only pending requests can be deleted",
        });
    }

    await IngredientRequest.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting ingredient request:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
