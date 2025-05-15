import Employee from "../models/Employee.Model.js";

export const AddEmployee = async (req, res) => {
  const employee = req.body;

  // Check for all required fields
  if (
    !employee.name ||
    !employee.mobileNo ||
    !employee.position ||
    !employee.salary ||
    !employee.bankAccountNo ||
    !employee.bank ||
    !employee.branch ||
    !employee.nicNo ||
    !employee.dateOfBirth ||
    !employee.address
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide all required fields: name, mobileNo, position, salary, bankAccountNo, bank, branch, nicNo, dateOfBirth, address",
    });
  }

  const newEmployee = new Employee(employee);

  try {
    await newEmployee.save();
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    console.error("Error in create employee:", error.message);
    // Handle duplicate NIC error
    if (error.code === 11000 && error.keyPattern.nicNo) {
      return res.status(400).json({
        success: false,
        message: "This NIC number is already registered.",
      });
    }
    // Handle other validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      return res.status(200).json({ success: true, data: employee });
    }

    const employees = await Employee.find();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error("Error in get employee:", error.message);
    // Handle invalid ID format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format",
      });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    // Check if NIC number is being updated and validate it
    if (updatedData.nicNo) {
      const nicRegex = /^[0-9]{9}[vV]$|^[0-9]{12}$/;
      if (!nicRegex.test(updatedData.nicNo)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid NIC number format. Must be 9 digits + 'v' or 12 digits",
        });
      }
    }

    const employee = await Employee.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true, // Ensure schema validation runs on update
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error("Error in update employee:", error.message);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format",
      });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete employee:", error.message);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format",
      });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// New function to check if NIC exists
export const checkNic = async (req, res) => {
  const { nicNo } = req.params;

  try {
    const employee = await Employee.findOne({ nicNo });
    res.status(200).json({ exists: !!employee });
  } catch (error) {
    console.error("Error in check NIC:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
