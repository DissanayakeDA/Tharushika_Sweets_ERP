import mongoose from "mongoose";
const Schema = mongoose.Schema;

const indirectSaleSchema = new Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
      default: () => `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
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
  },
  { collection: "indirect_sales" }
);

// Drop any existing indexes
indirectSaleSchema.indexes().forEach((index) => {
  indirectSaleSchema.index(index.fields, { unique: false });
});

// Create a new index for invoiceId
indirectSaleSchema.index({ invoiceId: 1 }, { unique: true });

const indirectSales = mongoose.model("indirectSales", indirectSaleSchema);

export default indirectSales;
