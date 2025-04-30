import mongoose from "mongoose";
const Schema = mongoose.Schema;

const IndirectReturnsSchema = new Schema({
  returnId: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true },
  items: [
    {
      itemName: String,
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  returnMethod: { type: String, required: true }, 
});

const IndirectReturns = mongoose.model("IndirectReturns", IndirectReturnsSchema);

export default IndirectReturns;
