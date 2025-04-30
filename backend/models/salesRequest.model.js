import mongoose from "mongoose";

const salesRequestSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    requested_quantity: {
      type: Number,
      required: true,
    },
    created_by: {
      type: String,
      required: true, // Username from login session
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const SalesRequest = mongoose.model("SalesRequest", salesRequestSchema);

export default SalesRequest;