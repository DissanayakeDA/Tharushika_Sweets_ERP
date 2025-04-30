import express from "express";
import indirectSales from "../models/indirectsales.model.js";
import SalesStock from "../models/salesstock.model.js";
const router = express.Router();

const generateInvoiceId = () => {
  return "INV-" + Date.now();
};

// Save sales record
router.post("/add", async (req, res) => {
  try {
    const { buyerId, items, totalAmount } = req.body;
    const invoiceId = generateInvoiceId();

    // Create a new sale record
    const indirectsale = new indirectSales({
      invoiceId,
      buyerId,
      items,
      totalAmount,
    });

    // Update stock quantities
    for (const item of items) {
      const salesstock = await SalesStock.findOne({ sp_name: item.itemName });

      if (salesstock) {
        if (salesstock.sp_quantity >= item.quantity) {
          salesstock.sp_quantity -= item.quantity;
          await salesstock.save();
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

    // Save the sale
    await indirectsale.save();

    res.status(201).json({ success: true, message: "Sale recorded successfully", invoiceId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch all sales records
router.get("/", async (req, res) => {
  try {
    const indirectsales = await indirectSales.find().select("invoiceId buyerId date totalAmount");
    res.status(200).json({ success: true, indirectsales});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch single sale details by invoiceId
router.get("/:invoiceId", async (req, res) => {
  try {
    const indirectsale = await indirectSales.findOne({ invoiceId: req.params.invoiceId });
    if (!indirectsale) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;