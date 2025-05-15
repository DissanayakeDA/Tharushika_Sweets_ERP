import express from "express";
import IndirectReturns from "../models/indirectreturns.model.js";
import SalesStock from "../models/salesstock.model.js";
const router = express.Router();

const generateIndirectReturnId = () => {
  return "InRet-" + Date.now();
};

// Debug endpoint to list all stock items
router.get("/debug/stock", async (req, res) => {
  try {
    const stockItems = await SalesStock.find({});
    res.json({
      message: "Available stock items",
      items: stockItems.map((item) => ({
        name: item.sp_name,
        quantity: item.sp_quantity,
        price: item.sp_price,
      })),
    });
  } catch (error) {
    console.error("Error fetching stock items:", error);
    res
      .status(500)
      .json({ message: "Error fetching stock items", error: error.message });
  }
});

// Save return record
router.post("/add", async (req, res) => {
  try {
    console.log("Received return data:", JSON.stringify(req.body, null, 2));

    const { buyerId, items, totalAmount, returnMethod } = req.body;

    // Validate required fields
    if (!buyerId) {
      console.log("Missing buyerId");
      return res.status(400).json({ message: "Buyer ID is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("Invalid items array:", items);
      return res.status(400).json({ message: "Valid items array is required" });
    }
    if (!returnMethod) {
      console.log("Missing returnMethod");
      return res.status(400).json({ message: "Return method is required" });
    }

    // Get all stock items for debugging
    const allStockItems = await SalesStock.find({});
    console.log(
      "All stock items in database:",
      JSON.stringify(allStockItems, null, 2)
    );
    console.log(
      "Available item names:",
      allStockItems.map((item) => item.sp_name)
    );

    // Check if all items have sufficient stock
    for (const item of items) {
      console.log("Checking stock for item:", item);
      console.log("Searching for item with name:", item.itemName);

      // Try to find the stock item with case-insensitive search
      const stock = await SalesStock.findOne({
        sp_name: { $regex: new RegExp(`^${item.itemName}$`, "i") },
      });

      console.log(
        "Found stock:",
        stock
          ? {
              name: stock.sp_name,
              quantity: stock.sp_quantity,
              price: stock.sp_price,
            }
          : "Not found"
      );

      if (!stock) {
        const availableItems = allStockItems
          .map((item) => item.sp_name)
          .join(", ");
        console.log("Available items:", availableItems);
        return res.status(400).json({
          message: `Stock not found for item "${item.itemName}". Available items: ${availableItems}`,
          availableItems: allStockItems.map((item) => ({
            name: item.sp_name,
            quantity: item.sp_quantity,
          })),
        });
      }
      if (stock.sp_quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.itemName}". Available: ${stock.sp_quantity}, Requested: ${item.quantity}`,
        });
      }
    }

    // Generate return ID
    const returnId = `InRet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    console.log("Generated return ID:", returnId);

    // Calculate total amount from items
    const calculatedTotalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create new return
    const newReturn = new IndirectReturns({
      indirectreturnId: returnId,
      returnId: returnId,
      buyerId,
      items,
      totalAmount:
        returnMethod === "issueMoney" ? totalAmount : calculatedTotalAmount,
      returnMethod,
      date: new Date(),
    });

    console.log(
      "Attempting to save new return:",
      JSON.stringify(newReturn, null, 2)
    );

    // Save return
    try {
      await newReturn.save();
      console.log("Return saved successfully");
    } catch (saveError) {
      console.error("Error saving return:", saveError);
      console.error("Error code:", saveError.code);
      console.error("Error name:", saveError.name);
      console.error("Error message:", saveError.message);
      console.error("Error stack:", saveError.stack);

      if (saveError.code === 11000) {
        return res.status(400).json({
          message: "Duplicate return ID. Please try again.",
          error: saveError.message,
        });
      }
      if (saveError.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation error",
          error: saveError.message,
          details: saveError.errors,
        });
      }
      throw saveError;
    }

    // Update stock quantities
    for (const item of items) {
      try {
        const result = await SalesStock.findOneAndUpdate(
          { sp_name: { $regex: new RegExp(`^${item.itemName}$`, "i") } },
          { $inc: { sp_quantity: -item.quantity } },
          { new: true }
        );
        console.log(`Updated stock for ${item.itemName}:`, result);
        console.log(
          `Subtracted ${item.quantity} from stock for ${item.itemName}`
        );
      } catch (stockError) {
        console.error(`Error updating stock for ${item.itemName}:`, stockError);
        // Continue with other items even if one fails
      }
    }

    res.status(201).json({
      message: "Return added successfully",
      return: newReturn,
    });
  } catch (error) {
    console.error("Detailed error in /add route:", error);
    console.error("Error stack:", error.stack);
    console.error("Error code:", error.code);
    console.error("Error name:", error.name);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
        details: error.errors,
      });
    }

    res.status(500).json({
      message: "Error adding return",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Fetch all return records
router.get("/", async (req, res) => {
  try {
    const returns = await IndirectReturns.find().sort({ createdAt: -1 });
    res.json(returns);
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({
      message: "Error fetching returns",
      error: error.message,
    });
  }
});

// Fetch single return details by returnId
router.get("/:returnId", async (req, res) => {
  try {
    const returnRecord = await IndirectReturns.findOne({
      indirectreturnId: req.params.returnId,
    });
    if (!returnRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Return record not found" });
    }
    res.status(200).json({ success: true, returnRecord });
  } catch (error) {
    console.error("Error fetching return record:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
