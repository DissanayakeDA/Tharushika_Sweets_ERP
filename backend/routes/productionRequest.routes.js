import express from "express";
import { 
    addProductionRequest, 
    getProductionRequest, 
    updateProductionRequest, 
    deleteProductionRequest 
} from "../controllers/productionRequest.controller.js";

const router = express.Router();

// Add a new production request
router.post("/", addProductionRequest);

// Get all production requests or a specific request by ID
router.get("/:id?", getProductionRequest); // id is optional

// Update an existing production request by ID
router.put("/:id", updateProductionRequest);

// Delete a production request by ID
router.delete("/:id", deleteProductionRequest);

export default router;