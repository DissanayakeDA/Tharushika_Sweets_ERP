import mongoose from "mongoose";
import Indirectbuyer from "../models/indirectbuyer.model.js";

export const getIndirectBuyers = async (req, res) => {
  try {
    const indirectbuyers = await Indirectbuyer.find({});
    res.status(200).json({ success: true, data: indirectbuyers });
  } catch (error) {
    console.log("error in fetching", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createIndirectbuyer = async (req, res) => {
  const indirectbuyer = req.body;

  if (
    !indirectbuyer.buyername ||
    !indirectbuyer.shopname ||
    !indirectbuyer.email ||
    !indirectbuyer.contact ||
    !indirectbuyer.address
  ) {
    return res
      .status(400)
      .json({ success: false, message: "please provide all fields" });
  }

  const newIndirectbuyer = new Indirectbuyer(indirectbuyer);

  try {
    await newIndirectbuyer.save();
    res.status(201).json({ success: true, data: newIndirectbuyer });
  } catch (error) {
    console.error("Error in create indirectbuyer:", error.message);
    res.status(500), json({ success: false, message: "server error" });
  }
};

export const getIndirectbuyerById = async (req, res) => {
  const { id } = req.params;

  try {
    const indirectbuyer = await Indirectbuyer.findById(id);
    res.status(200).json({ success: true, data: indirectbuyer });
  } catch (error) {
    console.log("error in fetching stock", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateIndirectbuyer = async (req, res) => {
  const { id } = req.params;
  const indirectbuyer = req.body;

  try {
    const updatedIndirectbuyer = await Indirectbuyer.findByIdAndUpdate(
      id,
      indirectbuyer,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedIndirectbuyer });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const deleteIndirectbuyer = async (req, res) => {
  const { id } = req.params;
  try {
    await Indirectbuyer.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "product deleted" });
  } catch (error) {
    console.log("error in deleting", error.message);
    res.status(404).json({ success: false, message: "product not found" });
  }
};
