//salesstock.js
import mongoose from "mongoose";

const salesstockSchema = new mongoose.Schema(
  {
    sp_name: {
      type: String,
      required: true,
    },
    sp_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    sp_price: {
      type: Number,
      required: false, // Optional since it defaults to 0
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SalesStock = mongoose.model("SalesStock", salesstockSchema);

export default SalesStock;