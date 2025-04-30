import mongoose from "mongoose";

const stockChangeRequestSchema = new mongoose.Schema(
  {
    stock_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    request_type: {
      type: String,
      enum: ["update", "delete"],
      required: true,
    },
    proposed_changes: {
      type: mongoose.Schema.Types.Mixed,
    },
    reason: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    reviewed_by: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const StockChangeRequest = mongoose.model(
  "StockChangeRequest",
  stockChangeRequestSchema
);

export default StockChangeRequest;
