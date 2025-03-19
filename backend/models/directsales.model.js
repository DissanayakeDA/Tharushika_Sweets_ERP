import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
  invoiceId: { type: String, required: true, unique: true }, 
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
});

const Sales = mongoose.model("Sales", SaleSchema);

export default Sales;
