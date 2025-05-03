import User from "../models/User.model.js";
import { createHash } from "crypto";

const hashPassword = (password) => {
  return createHash("sha256").update(password).digest("hex");
};

export const createUser = async (req, res) => {
  try {
    const { 
      employeeName, 
      accessLevel, 
      username, 
      password, 
      reenterPassword, 
      nicNo, 
      mobileNo, 
      email 
    } = req.body;

    // Check if passwords match
    if (password !== reenterPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Check for existing username, NIC, or email
    const existingUser = await User.findOne({ $or: [{ username }, { nicNo }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
      if (existingUser.nicNo === nicNo) {
        return res.status(400).json({ success: false, message: "NIC number already exists" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
    }

    // Hash the password before saving
    const hashedPassword = hashPassword(password);
    const user = new User({ 
      employeeName, 
      accessLevel, 
      username, 
      password: hashedPassword, 
      nicNo, 
      mobileNo, 
      email 
    });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};