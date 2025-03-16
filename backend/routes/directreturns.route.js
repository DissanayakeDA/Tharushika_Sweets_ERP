import express from "express";
import Returns from "../models/directreturns.model.js";
import Stock from "../models/stock.model.js"; // Ensure correct import

const router = express.Router();

// Generate unique return ID
const generateReturnId = () => {
  return "Ret-" + Date.now();
};

// Save return record
router.post("/add", async (req, res) => {
  try {
    const { buyerId, items, totalAmount, returnMethod } = req.body; // Added returnMethod
    const returnId = generateReturnId();

    // Create the return document
    const returnRecord = new Returns({
      returnId,
      buyerId,
      items,
      totalAmount,
      returnMethod, // Store return method in DB for reference
    });

    // If return method is "issueProduct", reduce stock quantity
    if (returnMethod === "issueProduct") {
      for (const item of items) {
        const stock = await Stock.findOne({ product_name: item.itemName });

        if (stock) {
          if (stock.product_quantity >= item.quantity) {
            stock.product_quantity -= item.quantity; // Reduce stock quantity
            await stock.save(); // Save the updated stock back to the database
          } else {
            return res.status(400).json({
              success: false,
              message: `Not enough stock for ${item.itemName}`,
            });
          }
        } else {
          return res.status(404).json({
            success: false,
            message: `Stock not found for ${item.itemName}`,
          });
        }
      }
    }

    // Save the return record
    await returnRecord.save();

    res.status(201).json({
      success: true,
      message: "Return recorded successfully",
      returnId,
    });
  } catch (error) {
    console.error("Error in /add return route:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch all return records
router.get("/", async (req, res) => {
  try {
    const returns = await Returns.find().select("returnId buyerId date totalAmount returnMethod");
    res.status(200).json({ success: true, returns });
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch single return details by returnId
router.get("/:returnId", async (req, res) => {
  try {
    const returnRecord = await Returns.findOne({ returnId: req.params.returnId });
    if (!returnRecord) {
      return res.status(404).json({ success: false, message: "Return record not found" });
    }
    res.status(200).json({ success: true, returnRecord }); // Ensure this matches the frontend expectation
  } catch (error) {
    console.error("Error fetching return record:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
