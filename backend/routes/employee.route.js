import express from "express";
import { AddEmployee, getEmployee, updateEmployee, deleteEmployee } from "../controllers/employee.controller.js"; 

const router = express.Router();

// Add a new employee
router.post("/", AddEmployee);

// Get all employees or a specific employee by ID
router.get("/:id?", getEmployee);  // id is optional, so it can handle both single and multiple employees

// Update an existing employee by ID
router.put("/:id", updateEmployee);

// Delete an employee by ID
router.delete("/:id", deleteEmployee);

export default router;
