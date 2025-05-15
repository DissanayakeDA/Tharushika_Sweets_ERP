// server/src/models/Attendance.Model.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  records: [
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
      status: { type: String, enum: ["Present", "Absent"], required: true },
    },
  ],
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
