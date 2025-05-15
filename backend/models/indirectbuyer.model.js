import mongoose from "mongoose";

const indirectbuyerSchema = new mongoose.Schema({
  buyername: {
    type: String,
    required: true,
  },
  shopname: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const Indirectbuyer = mongoose.model("Indirectbuyer", indirectbuyerSchema);

export default Indirectbuyer;
