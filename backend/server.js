import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import stockRoutes from "./routes/stock.route.js";
import cors from "cors";
import router from "./routes/directbuyer.route.js";
import fs from "fs";
import "./models/directinvoice.model.js";
import IngredientRoutes from "./routes/ingredient.route.js";
import supplierRoutes from "./routes/supplier.route.js";
import salesRoutes from "./routes/directsales.route.js";
import returnRoutes from "./routes/directreturns.route.js";
import employeeRoutes from "./routes/employee.route.js";
import attendanceRoutes from "./routes/attendance.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
  })
);
app.use("/api/products", productRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/ingredients", IngredientRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use(cors());

app.use("/buyers", router);
const dir = "./files";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
app.use("/files", express.static("files"));

//direct sales
app.use("/api/sales", salesRoutes);
app.post("/api/sales/add", async (req, res) => {
  try {
    console.log("Received Data:", req.body); 
    const { buyerId, items, totalAmount } = req.body;

    if (!buyerId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const newSale = { buyerId, items, totalAmount, date: new Date() };
    const result = await db.collection("sales").insertOne(newSale);

    res.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//directreturns

app.use("/api/returns", returnRoutes);
app.post("/api/returns/add", async (req, res) => {
  try {
    console.log("Received Data:", req.body); 
    const { buyerId, items, totalAmount } = req.body;

    if (!buyerId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const newReturn = { buyerId, items, totalAmount, date: new Date() };
    const result = await db.collection("returns").insertOne(newReturn);

    res.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on http://localhost:" + PORT);
});
