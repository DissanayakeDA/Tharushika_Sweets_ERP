// client/src/Component/ViewAttendance/ViewAttendance.jsx
import React, { useState, useEffect } from "react";
import HRNav from "../HRNav/HRNav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./ViewAttendance.css";

function ViewAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/attendance");
      if (response.data.success) {
        setAttendanceRecords(response.data.data);
      } else {
        setError("Failed to fetch attendance.");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Error fetching attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const recordDate = new Date(record.date).toISOString().split("T")[0];
    return recordDate === selectedDate;
  });

  // Download PDF function
  const downloadPDF = () => {
    // Clone the attendance-content div to manipulate it
    const content = document.querySelector(".attendance-content").cloneNode(true);
    
    // Remove the date-picker section (which includes the button)
    const datePicker = content.querySelector(".date-picker");
    if (datePicker) datePicker.remove();

    // Replace the title with "Employee Attendance on [Date]"
    const title = content.querySelector(".attendance-title");
    if (title) title.textContent = `Employee Attendance on ${new Date(selectedDate).toLocaleDateString()}`;

    const printContent = content.innerHTML;
    
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee Attendance - ${new Date(selectedDate).toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .attendance-title { font-size: 24px; text-align: center; margin-bottom: 20px; }
            .attendance-day { margin-bottom: 20px; }
            .attendance-section { margin-bottom: 15px; }
            h3 { font-size: 20px; color: #34495e; }
            h4 { font-size: 16px; color: #2c3e50; }
            ul { list-style: none; padding: 0; }
            .present-list li { background: #e8f5e9; padding: 5px; margin: 5px 0; }
            .absent-list li { background: #ffebee; padding: 5px; margin: 5px 0; }
            .no-data { color: #7f8c8d; font-style: italic; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();

    // Wait for content to render, then trigger print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <div className="view-attendance-container">
      <HRNav />
      <HeadBar />
      <div className="attendance-content">
        <h2 className="attendance-title">View Attendance</h2>

        {/* Date Picker */}
        <div className="date-picker">
          <label htmlFor="attendance-date">Select Date: </label>
          <input
            type="date"
            id="attendance-date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split("T")[0]}
          />
          <button onClick={downloadPDF} className="download-btn">
            Download PDF
          </button>
        </div>

        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {filteredRecords.map((record) => (
          <div key={record._id} className="attendance-day">
            <h3>{new Date(record.date).toLocaleDateString()}</h3>
            <div className="attendance-section">
              <h4>Present</h4>
              <ul className="attendance-list present-list">
                {record.records
                  .filter((r) => r.status === "Present")
                  .map((r) => (
                    <li key={r.employeeId._id}>
                      {r.employeeId.name} ({r.employeeId.nicNo})
                    </li>
                  ))}
                {record.records.filter((r) => r.status === "Present").length === 0 && (
                  <li className="no-data">No employees present</li>
                )}
              </ul>
            </div>
            <div className="attendance-section">
              <h4>Absent</h4>
              <ul className="attendance-list absent-list">
                {record.records
                  .filter((r) => r.status === "Absent")
                  .map((r) => (
                    <li key={r.employeeId._id}>
                      {r.employeeId.name} ({r.employeeId.nicNo})
                    </li>
                  ))}
                {record.records.filter((r) => r.status === "Absent").length === 0 && (
                  <li className="no-data">No employees absent</li>
                )}
              </ul>
            </div>
          </div>
        ))}
        {filteredRecords.length === 0 && !loading && (
          <p className="no-data">No attendance records for {new Date(selectedDate).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}

export default ViewAttendance;