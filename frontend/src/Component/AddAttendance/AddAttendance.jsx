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
  const [dateExists, setDateExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employee");
        console.log("Employee API Response:", response.data);
        if (response.data.success) {
          setEmployees(response.data.data);
          const initialAttendance = {};
          response.data.data.forEach((emp) => {
            initialAttendance[emp._id] = "Absent";
          });
          setAttendance(initialAttendance);
        } else {
          setError("Failed to fetch employees.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching employees.");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const checkAttendanceExists = async () => {
      if (!date) {
        setDateExists(false);
        setError(null);
        return;
      }

      try {
        console.log("Checking attendance for date:", date);
        const response = await axios.get(
          `http://localhost:5000/api/attendance?date=${date}`
        );
        console.log("Attendance API Response:", response.data);
        console.log("Response data:", response.data.data);
        console.log("Response data type:", typeof response.data.data);
        console.log(
          "Response data length:",
          Array.isArray(response.data.data) ? response.data.data.length : "N/A"
        );

        if (response.data.success) {
          const attendanceData = response.data.data;
          const hasRecords =
            Array.isArray(attendanceData) && attendanceData.length > 0;

          console.log("Calculated hasRecords:", hasRecords);

          setDateExists(hasRecords);
          if (hasRecords) {
            setError(
              "Attendance for this date has already been recorded. Please select another date."
            );
          } else {
            setError(null);
          }
        } else {
          console.error("API returned success: false:", response.data.message);
          setError(
            response.data.message || "Failed to check existing attendance."
          );
        }
      } catch (error) {
        console.error("Error checking attendance:", error);
        console.log("Error response:", error.response?.data);
        setError(error.response?.data?.message || "Error checking attendance.");
      }
    };
    checkAttendanceExists();
  }, [date]);

  const handleAttendanceChange = (employeeId, status) => {
    setAttendance((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (dateExists) {
      setError(
        "Attendance for this date has already been recorded. Please select another date."
      );
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
      console.log("Submitting attendance data:", attendanceData);
      const response = await axios.post(
        "http://localhost:5000/api/attendance",
        attendanceData
      );
      console.log("Submit API Response:", response.data);
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
      <div className="hrnav-wrapper">
        <HRNav />
      </div>
      <div className="headbar-wrapper">
        <HeadBar />
      </div>
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
              // Removed disabled={dateExists}
            />
          </div>
          <div className="employee-list">
            {employees.map((employee) => (
              <div key={employee._id} className="employee-row">
                <span className="employee-name">
                  {employee.name} ({employee.nicNo})
                </span>
                <div className="attendance-buttons">
                  <button
                    type="button"
                    className={`status-btn ${
                      attendance[employee._id] === "Present" ? "present" : ""
                    }`}
                    onClick={() =>
                      handleAttendanceChange(employee._id, "Present")
                    }
                    disabled={dateExists}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    className={`status-btn ${
                      attendance[employee._id] === "Absent" ? "absent" : ""
                    }`}
                    onClick={() =>
                      handleAttendanceChange(employee._id, "Absent")
                    }
                    disabled={dateExists}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={dateExists || !date}
          >
            Submit Attendance
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAttendance;
