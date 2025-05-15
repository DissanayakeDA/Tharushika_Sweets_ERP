import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debug: Log environment variables (remove in production)
console.log("Email configuration:", {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD ? "Password is set" : "Password is not set"
});

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP configuration error:", error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

export const sendPasswordResetEmail = async (email, resetToken) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("Email credentials are not properly configured");
    return false;
  }

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}; 