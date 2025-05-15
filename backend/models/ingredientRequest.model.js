import mongoose from "mongoose";

const ingredientRequestSchema = new mongoose.Schema(
  {
    ingredient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    request_quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const IngredientRequest = mongoose.model(
  "IngredientRequest",
  ingredientRequestSchema
);

export default IngredientRequest;
