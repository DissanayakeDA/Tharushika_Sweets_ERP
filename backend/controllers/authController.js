import User from "../models/User.model.js";
import { createHash } from "crypto"; // Import Node.js crypto module
import crypto from "crypto"; // For generating reset tokens
import { sendPasswordResetEmail } from "../config/emailConfig.js";

const hashPassword = (password) => {
  return createHash("sha256").update(password).digest("hex");
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Hash the entered password and compare with stored hash
    const hashedInputPassword = hashPassword(password);
    if (user.password !== hashedInputPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, we don't reveal if the email exists or not
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, you will receive password reset instructions.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Update user with reset token
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      // If email fails to send, remove the reset token
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash the new password
    const hashedPassword = hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
