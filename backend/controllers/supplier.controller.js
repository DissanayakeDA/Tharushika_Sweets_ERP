import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";

//add supplier
export const addSupplier = async (req, res) => {
  const supplier = req.body;

  if (
    !supplier.supplier_name ||
    !supplier.supplier_address ||
    !supplier.supplier_phone ||
    !supplier.supplier_email
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all details" });
  }

  const newSupplier = new Supplier(supplier);

  try {
    await newSupplier.save();
    res.status(201).json({ success: true, data: newSupplier });
  } catch (error) {
    console.error("Error in create supplier", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//get all suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    console.log("error in fetching suppliers", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//get supplier by ID

export const getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findById(id);
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    console.log("error in fetching supplier", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//update supplier

export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const supplier = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Supplier ID" });
  }

  try {
    await Supplier.findByIdAndUpdate(id, supplier, { new: true });
    res.status(200).json({ success: true, message: "Supplier updated" });
  } catch (error) {
    console.log("error in updating supplier", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//delete supplier

export const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Supplier ID" });
  }

  try {
    await Supplier.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Supplier deleted" });
  } catch (error) {
    console.log("error in deleting supplier", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
