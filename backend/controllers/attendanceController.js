import Attendance from "../models/Attendance.model.js";

export const addAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }
    const normalizedDate = new Date(date).toISOString().split("T")[0];
    const attendance = new Attendance({ date: normalizedDate, records });
    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    let attendance;

    if (date) {
      const normalizedDate = new Date(date);
      if (isNaN(normalizedDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format" });
      }
      const dateString = normalizedDate.toISOString().split("T")[0];
      attendance = await Attendance.find({ date: dateString }).populate(
        "records.employeeId",
        "name nicNo"
      );
    } else {
      attendance = await Attendance.find().populate(
        "records.employeeId",
        "name nicNo"
      );
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }
    const normalizedDate = new Date(date).toISOString().split("T")[0];

    // Find and update the attendance record for the given date
    const attendance = await Attendance.findOneAndUpdate(
      { date: normalizedDate },
      { records },
      { new: true, runValidators: true }
    ).populate("records.employeeId", "name nicNo");

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No attendance record found for this date",
      });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
