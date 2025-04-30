import ProductionRequest from "../models/ProductionRequest.Model.js";

export const addProductionRequest = async (req, res) => {
    const productionRequest = req.body;

    // Check for all required fields
    if (!productionRequest.itemName || !productionRequest.quantity || 
        !productionRequest.unit || !productionRequest.dateNeeded || 
        !productionRequest.managerId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields: itemName, quantity, unit, dateNeeded, managerId"
        });
    }

    const newProductionRequest = new ProductionRequest(productionRequest);

    try {
        await newProductionRequest.save();
        res.status(201).json({ success: true, data: newProductionRequest });
    } catch (error) {
        console.error("Error in create production request:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getProductionRequest = async (req, res) => {
    const { id } = req.params;

    try {
        if (id) {
            const productionRequest = await ProductionRequest.findById(id).populate('managerId', 'name');
            if (!productionRequest) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Production request not found" 
                });
            }
            return res.status(200).json({ success: true, data: productionRequest });
        }

        const productionRequests = await ProductionRequest.find().populate('managerId', 'name');
        res.status(200).json({ success: true, data: productionRequests });
    } catch (error) {
        console.error("Error in get production request:", error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid production request ID format" 
            });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateProductionRequest = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const productionRequest = await ProductionRequest.findByIdAndUpdate(
            id,
            updatedData,
            { 
                new: true,
                runValidators: true
            }
        ).populate('managerId', 'name');

        if (!productionRequest) {
            return res.status(404).json({ 
                success: false, 
                message: "Production request not found" 
            });
        }

        res.status(200).json({ success: true, data: productionRequest });
    } catch (error) {
        console.error("Error in update production request:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid production request ID format" 
            });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteProductionRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const productionRequest = await ProductionRequest.findByIdAndDelete(id);

        if (!productionRequest) {
            return res.status(404).json({ 
                success: false, 
                message: "Production request not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Production request deleted successfully" 
        });
    } catch (error) {
        console.error("Error in delete production request:", error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid production request ID format" 
            });
        }
        res.status(500).json({ success: false, message: "Server Error" });
    }
};