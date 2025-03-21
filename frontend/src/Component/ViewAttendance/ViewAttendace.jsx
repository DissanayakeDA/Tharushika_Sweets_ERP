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
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/api/attendance", {
        timeout: 10000,
      });
      console.log("API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        setAttendanceRecords(response.data.data);
        console.log("Attendance Records Set:", response.data.data);
      } else {
        setError("Invalid attendance data received from server.");
        console.warn("Invalid Response Structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error.message);
      if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please check the server.");
      } else if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        setError("No response from server. Check if the server is running.");
      } else {
        setError("Failed to fetch attendance records: " + error.message);
      }
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    if (!record.date) {
      console.warn("Record missing date:", record);
      return false;
    }
    const recordDate = new Date(record.date).toISOString().split("T")[0];
    return recordDate === selectedDate;
  });

  const downloadPDF = () => {
    const printWindow = window.open("", "_blank");
    const docContent = `
      <html>
        <head>
          <title>Employee Attendance - ${new Date(selectedDate).toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 24px; text-align: center; margin-bottom: 20px; }
            .attendance-day { margin-bottom: 20px; }
            h3 { font-size: 20px; color: #34495e; }
            h4 { font-size: 16px; color: #2c3e50; margin: 10px 0 5px; }
            ul { list-style: none; padding: 0; }
            .present-list li { background: #e8f5e9; padding: 5px; margin: 5px 0; }
            .absent-list li { background: #ffebee; padding: 5px; margin: 5px 0; }
            .no-data { color: #7f8c8d; font-style: italic; }
          </style>
        </head>
        <body>
          <h1>Employee Attendance on ${new Date(selectedDate).toLocaleDateString()}</h1>
          ${
            filteredRecords.length === 0
              ? "<p class='no-data'>No attendance records for this date.</p>"
              : filteredRecords
                  .map(
                    (record) => `
                      <div class='attendance-day'>
                        <h3>${new Date(record.date).toLocaleDateString()}</h3>
                        <div>
                          <h4>Present</h4>
                          <ul class='present-list'>
                            ${
                              record.records
                                .filter((r) => r.status === "Present")
                                .map(
                                  (r) =>
                                    `<li>${r.employeeId?.name || "Unknown"} (${r.employeeId?.nicNo || "N/A"})</li>`
                                )
                                .join("") || "<li class='no-data'>No employees present</li>"
                            }
                          </ul>
                        </div>
                        <div>
                          <h4>Absent</h4>
                          <ul class='absent-list'>
                            ${
                              record.records
                                .filter((r) => r.status === "Absent")
                                .map(
                                  (r) =>
                                    `<li>${r.employeeId?.name || "Unknown"} (${r.employeeId?.nicNo || "N/A"})</li>`
                                )
                                .join("") || "<li class='no-data'>No employees absent</li>"
                            }
                          </ul>
                        </div>
                      </div>
                    `
                  )
                  .join("")
          }
        </body>
      </html>
    `;

    printWindow.document.write(docContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <>
      <HeadBar /> {/* Moved outside the container */}
      <div className="view-attendance-container">
        <HRNav />
        <div className="attendance-content">
          <h2 className="attendance-title">View Attendance</h2>

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

          {loading && <p className="loading-text">Loading attendance data...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && filteredRecords.length === 0 && (
            <p className="no-data">No attendance records for {new Date(selectedDate).toLocaleDateString()}</p>
          )}
          {!loading &&
            filteredRecords.map((record) => (
              <div key={record._id} className="attendance-day">
                <h3>{new Date(record.date).toLocaleDateString()}</h3>
                <div className="attendance-section">
                  <h4>Present</h4>
                  <ul className="attendance-list present-list">
                    {record.records
                      .filter((r) => r.status === "Present")
                      .map((r) => (
                        <li key={r.employeeId?._id || r._id}>
                          {r.employeeId?.name || "Unknown"} ({r.employeeId?.nicNo || "N/A"})
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
                        <li key={r.employeeId?._id || r._id}>
                          {r.employeeId?.name || "Unknown"} ({r.employeeId?.nicNo || "N/A"})
                        </li>
                      ))}
                    {record.records.filter((r) => r.status === "Absent").length === 0 && (
                      <li className="no-data">No employees absent</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ViewAttendance;