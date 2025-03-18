import express from "express";
import Sales from "../models/directsales.model.js";
import Stock from "../models/stock.model.js"; // Make sure this import is added
const router = express.Router();

// Generate unique invoice ID
const generateInvoiceId = () => {
  return "INV-" + Date.now();
};

// Save sales record
router.post("/add", async (req, res) => {
  try {
    const { buyerId, items, totalAmount } = req.body;
    const invoiceId = generateInvoiceId();

    // Create the sale document
    const sale = new Sales({
      invoiceId,
      buyerId,
      items,
      totalAmount,
    });

    // Loop through each item in the sale and reduce stock quantity
    for (const item of items) {
      const stock = await Stock.findOne({ product_name: item.itemName });

      if (stock) {
        if (stock.product_quantity >= item.quantity) {
          stock.product_quantity -= item.quantity;  // Reduce stock quantity
          await stock.save();  // Save the updated stock back to the database
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
    await sale.save();

    res.status(201).json({ success: true, message: "Sale recorded successfully", invoiceId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch all sales records (display invoices)
router.get("/", async (req, res) => {
  try {
    const sales = await Sales.find().select("invoiceId buyerId date totalAmount");
    res.status(200).json({ success: true, sales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch single sale details by invoiceId
router.get("/:invoiceId", async (req, res) => {
  try {
    const sale = await Sales.findOne({ invoiceId: req.params.invoiceId });
    if (!sale) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
