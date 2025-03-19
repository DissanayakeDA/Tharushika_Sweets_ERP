import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReturnsSchema = new Schema({
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

const Returns = mongoose.model("Returns", ReturnsSchema);

export default Returns;
