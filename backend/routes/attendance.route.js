import {
  addAttendance,
  getAttendance,
  updateAttendance,
} from "../controllers/attendanceController.js";
import express from "express";
const router = express.Router();

router.post("/", addAttendance);
router.get("/", getAttendance);
router.put("/", updateAttendance);

export default router;
