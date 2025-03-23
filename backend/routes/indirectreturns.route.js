import express from "express";
import IndirectReturns from "../models/indirectreturns.model.js";
import SalesRequest from "../models/salesRequest.model.js"; 

const router = express.Router();

const generateIndirectReturnId = () => {
  return "InRet-" + Date.now();
};

// Save return record
router.post("/add", async (req, res) => {
  try {
    const { buyerId, items, totalAmount, returnMethod } = req.body; 
    const returnId = generateIndirectReturnId();

    const returnRecord = new IndirectReturns({
      returnId,
      buyerId,
      items,
      totalAmount,
      returnMethod, 
    });

    if (returnMethod === "issueProduct") {
      for (const item of items) {
        const SalesRequest = await SalesRequest.findOne({ product_name: item.itemName });

        if (SalesRequest) {
          if (SalesRequest.product_quantity >= item.quantity) {
            SalesRequest.product_quantity -= item.quantity; 
            await SalesRequest.save(); 
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
    const IndirectReturns = await IndirectReturns.find().select("returnId buyerId date totalAmount returnMethod");
    res.status(200).json({ success: true, returns });
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch single return details by returnId
router.get("/:returnId", async (req, res) => {
  try {
    const returnRecord = await IndirectReturns.findOne({ returnId: req.params.returnId });
    if (!returnRecord) {
      return res.status(404).json({ success: false, message: "Return record not found" });
    }
    res.status(200).json({ success: true, returnRecord }); 
  } catch (error) {
    console.error("Error fetching return record:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
