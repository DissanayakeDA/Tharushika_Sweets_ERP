// server/src/controllers/attendanceController.js
import Attendance from "../models/Attendance.Model.js";

// Named export for addAttendance
export const addAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    const attendance = new Attendance({ date, records });
    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Named export for getAttendance
export const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("records.employeeId", "name nicNo");
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};