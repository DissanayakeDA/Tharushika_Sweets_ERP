import User from "../models/User.model.js";
import { createHash } from "crypto"; // Import Node.js crypto module


const hashPassword = (password) => {
  return createHash("sha256").update(password).digest("hex");
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // Hash the entered password and compare with stored hash
    const hashedInputPassword = hashPassword(password);
    if (user.password !== hashedInputPassword) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        accessLevel: user.accessLevel,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};