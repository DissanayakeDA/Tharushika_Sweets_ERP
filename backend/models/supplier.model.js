import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    supplier_name: {
      type: String,
      required: true,
    },
    supplier_address: {
      type: String,
      required: true,
    },
    supplier_phone: {
      type: String,
      required: true,
    },

    supplier_email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
