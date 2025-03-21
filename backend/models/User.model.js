import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  accessLevel: {
    type: String,
    enum: [
      "Executive",
      "Supply Management",
      "Production Management",
      "Employee Management",
      "Stock Management"
    ],
    required: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;