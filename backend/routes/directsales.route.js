import express from "express";
import Sales from "../models/directsales.model.js";
import Stock from "../models/stock.model.js"; 
const router = express.Router();


const generateInvoiceId = () => {
  return "INV-" + Date.now();
};

// Save sales record
router.post("/add", async (req, res) => {
  try {
    const { buyerId, items, totalAmount } = req.body;
    const invoiceId = generateInvoiceId();

   
    const sale = new Sales({
      invoiceId,
      buyerId,
      items,
      totalAmount,
    });

    
    for (const item of items) {
      const stock = await Stock.findOne({ product_name: item.itemName });

      if (stock) {
        if (stock.product_quantity >= item.quantity) {
          stock.product_quantity -= item.quantity;  
          await stock.save();  
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
