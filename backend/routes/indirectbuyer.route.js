import express from "express";

import {
  createIndirectbuyer,
  deleteIndirectbuyer,
  getIndirectBuyers,
  updateIndirectbuyer,
  getIndirectbuyerById,
} from "../controllers/indirectbuyercontroller.js";

const router = express.Router();

router.get("/", getIndirectBuyers);
router.post("/", createIndirectbuyer);
router.get("/:id", getIndirectbuyerById);
router.put("/:id", updateIndirectbuyer);
router.delete("/:id", deleteIndirectbuyer);

export default router;
