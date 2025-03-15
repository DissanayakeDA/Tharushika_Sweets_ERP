import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import stockRoutes from "./routes/stock.route.js";
import cors from "cors";
import router from "./routes/directbuyer.route.js";
import multer from "multer";
import fs from "fs";
import "./models/directinvoice.model.js";

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

app.use("/api/stocks", stockRoutes);

app.use(cors());

app.use("/buyers", router);
const dir = "./files";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
app.use("/files", express.static("files"));

//InvoicePdf

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

//Insert Model Part(pdf)

const pdfSchema = mongoose.model("InvoiceDetails");
const upload = multer({ storage });

app.post("/uploadfile", upload.single("file"), async (req, res) => {
  console.log(res.file);
  const title = req.body.title;
  const pdf = req.file.filename;
  try {
    await pdfSchema.create({ title: title, pdf: pdf });
    console.log("Pdf Upload Successfully");
    res.send({ status: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "error" });
  }
});

app.get("/getFile", async (req, res) => {
  try {
    const data = await pdfSchema.find({});
    res.send({ status: 200, data: data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "error" });
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on http://localhost:" + PORT);
});
