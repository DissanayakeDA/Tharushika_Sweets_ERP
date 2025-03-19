import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    product_price: {
      type: Number,
      required: false, // Optional since it defaults to 0
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
