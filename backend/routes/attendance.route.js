// server/src/routes/attendance.route.js
import express from "express";
import { addAttendance, getAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/", addAttendance);
router.get("/", getAttendance);

export default router;