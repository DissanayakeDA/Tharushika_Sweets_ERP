import User from "../models/User.model.js";
import { createHash } from "crypto"; // Import Node.js crypto module

// Function to hash a password using SHA-256
const hashPassword = (password) => {
  return createHash("sha256").update(password).digest("hex");
};

export const createUser = async (req, res) => {
  try {
    const { employeeName, accessLevel, username, password, reenterPassword } = req.body;

    if (password !== reenterPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    // Hash the password before saving
    const hashedPassword = hashPassword(password);
    const user = new User({ employeeName, accessLevel, username, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Keep getUsers and deleteUser as they are
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