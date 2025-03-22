// client/src/Component/AddAttendance/AddAttendance.jsx
import React, { useState, useEffect } from "react";
import HRNav from "../HRNav/HRNav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddAttendance.css";

function AddAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employee");
        if (response.data.success) {
          setEmployees(response.data.data);
          // Initialize attendance state with all employees as "Absent" by default
          const initialAttendance = {};
          response.data.data.forEach((emp) => {
            initialAttendance[emp._id] = "Absent";
          });
          setAttendance(initialAttendance);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching employees.");
      }
    };
    fetchEmployees();
  }, []);

  const handleAttendanceChange = (employeeId, status) => {
    setAttendance((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      setError("Please select a date.");
      return;
    }

    const attendanceData = {
      date,
      records: Object.keys(attendance).map((employeeId) => ({
        employeeId,
        status: attendance[employeeId],
      })),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/attendance", attendanceData);
      if (response.data.success) {
        navigate("/viewattendance");
      } else {
        setError(response.data.message || "Failed to submit attendance.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setError(error.response?.data?.message || "Error submitting attendance.");
    }
  };

  return (
    <div className="add-attendance-container">
      <HRNav />
      <HeadBar />
      <div className="attendance-content">
        <h2 className="attendance-title">Add Attendance</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="employee-list">
            {employees.map((employee) => (
              <div key={employee._id} className="employee-row">
                <span className="employee-name">{employee.name} ({employee.nicNo})</span>
                <div className="attendance-buttons">
                  <button
                    type="button"
                    className={`status-btn ${attendance[employee._id] === "Present" ? "present" : ""}`}
                    onClick={() => handleAttendanceChange(employee._id, "Present")}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    className={`status-btn ${attendance[employee._id] === "Absent" ? "absent" : ""}`}
                    onClick={() => handleAttendanceChange(employee._id, "Absent")}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="submit-btn">Submit Attendance</button>
        </form>
      </div>
    </div>
  );
}

export default AddAttendance;