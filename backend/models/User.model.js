import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  accessLevel: {
    type: String,
    enum: [
      "Executive",
      "Sales Management",
      "Production Management",
      "Employee Management",
      "Stock Management",
    ],
    required: true,
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nicNo: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[0-9]{9}[vV]$|^[0-9]{12}$/ // NIC format: 9 digits + 'v'/'V'/'x'/'X' or 12 digits
  },
  mobileNo: { 
    type: String, 
    required: true, 
    match: /^[0-9]{10}$/ // 10-digit mobile number
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email format
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;