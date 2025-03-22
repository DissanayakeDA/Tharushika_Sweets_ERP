import mongoose from "mongoose";
const Schema = mongoose.Schema;

const indirectSaleSchema = new Schema({
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

const indirectSales = mongoose.model("indirectSales", indirectSaleSchema);

export default indirectSales;