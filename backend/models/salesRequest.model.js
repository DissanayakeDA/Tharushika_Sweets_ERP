import mongoose from "mongoose";

const salesRequestSchema = new mongoose.Schema({
  items: [
    {
      product_name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, default: 0 },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

const SalesRequest = mongoose.model("SalesRequest", salesRequestSchema);
export default SalesRequest;