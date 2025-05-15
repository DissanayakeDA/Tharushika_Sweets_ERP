import mongoose from "mongoose";
const Schema = mongoose.Schema;

const IndirectReturnsSchema = new Schema({
  indirectreturnId: { type: String, required: true, unique: true },
  returnId: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true },
  items: [
    {
      itemId: String,
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  returnMethod: {
    type: String,
    required: true,
    enum: ["issueProduct", "issueMoney"],
  },
});

const IndirectReturns = mongoose.model(
  "IndirectReturns",
  IndirectReturnsSchema
);

export default IndirectReturns;
