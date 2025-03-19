import express from "express";
const router = express.Router();
import Buyer from "../models/directbuyer.model.js";

import * as BuyerController from "../controllers/directbuyer.controller.js";

router.get("/", BuyerController.getAllBuyers);
router.post("/", BuyerController.addBuyers);
router.get("/:id", BuyerController.getById);
router.put("/:id", BuyerController.updateBuyer);
router.delete("/:id", BuyerController.deleteBuyer);



export default router;
