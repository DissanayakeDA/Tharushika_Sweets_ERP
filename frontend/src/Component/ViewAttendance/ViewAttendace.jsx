import React, { useState, useEffect } from "react";
import HRNav from "../HRNav/HRNav";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import "./ViewAttendance.css";

function ViewAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editMode, setEditMode] = useState(false);
  const [editedAttendance, setEditedAttendance] = useState({});

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
        setError(
          `Server error: ${error.response.status} - ${
            error.response.data.message || "Unknown error"
          }`
        );
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
    setEditMode(false); // Exit edit mode when changing date
    setEditedAttendance({}); // Reset edited attendance
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    if (!record.date) {
      console.warn("Record missing date:", record);
      return false;
    }
    const recordDate = new Date(record.date).toISOString().split("T")[0];
    return recordDate === selectedDate;
  });

  const handleEditToggle = () => {
    if (!editMode && filteredRecords.length > 0) {
      // Initialize editedAttendance with current records
      const initialAttendance = {};
      filteredRecords[0].records.forEach((record) => {
        initialAttendance[record.employeeId._id] = record.status;
      });
      setEditedAttendance(initialAttendance);
    }
    setEditMode(!editMode);
  };

  const handleAttendanceChange = (employeeId, status) => {
    setEditedAttendance((prev) => ({ ...prev, [employeeId]: status }));
  };

  const handleSaveChanges = async () => {
    if (filteredRecords.length === 0) {
      setError("No attendance record to edit for this date.");
      return;
    }

    const attendanceData = {
      date: selectedDate,
      records: Object.keys(editedAttendance).map((employeeId) => ({
        employeeId,
        status: editedAttendance[employeeId],
      })),
    };

    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/attendance",
        attendanceData
      );
      console.log("Update API Response:", response.data);
      if (response.data.success) {
        setEditMode(false);
        setEditedAttendance({});
        await fetchAttendance(); // Refresh records
      } else {
        setError(response.data.message || "Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      setError(error.response?.data?.message || "Error updating attendance.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const printWindow = window.open("", "_blank");
    const docContent = `
      <html>
        <head>
          <title>Employee Attendance - ${new Date(
            selectedDate
          ).toLocaleDateString()}</title>
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
          <h1>Employee Attendance on ${new Date(
            selectedDate
          ).toLocaleDateString()}</h1>
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
                                    `<li>${r.employeeId?.name || "Unknown"} (${
                                      r.employeeId?.nicNo || "N/A"
                                    })</li>`
                                )
                                .join("") ||
                              "<li class='no-data'>No employees present</li>"
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
                                    `<li>${r.employeeId?.name || "Unknown"} (${
                                      r.employeeId?.nicNo || "N/A"
                                    })</li>`
                                )
                                .join("") ||
                              "<li class='no-data'>No employees absent</li>"
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
      <HeadBar />
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
            {filteredRecords.length > 0 && (
              <button
                onClick={handleEditToggle}
                className="edit-btn"
                disabled={loading}
              >
                {editMode ? "Cancel Edit" : "Edit Attendance"}
              </button>
            )}
          </div>

          {loading && (
            <p className="loading-text">Loading attendance data...</p>
          )}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && filteredRecords.length === 0 && (
            <p className="no-data">
              No attendance records for{" "}
              {new Date(selectedDate).toLocaleDateString()}
            </p>
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
                          {editMode ? (
                            <div className="edit-attendance">
                              <span>
                                {r.employeeId?.name || "Unknown"} (
                                {r.employeeId?.nicNo || "N/A"})
                              </span>
                              <div className="attendance-buttons">
                                <button
                                  type="button"
                                  className={`status-btn ${
                                    editedAttendance[r.employeeId._id] ===
                                    "Present"
                                      ? "present"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttendanceChange(
                                      r.employeeId._id,
                                      "Present"
                                    )
                                  }
                                >
                                  Present
                                </button>
                                <button
                                  type="button"
                                  className={`status-btn ${
                                    editedAttendance[r.employeeId._id] ===
                                    "Absent"
                                      ? "absent"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttendanceChange(
                                      r.employeeId._id,
                                      "Absent"
                                    )
                                  }
                                >
                                  Absent
                                </button>
                              </div>
                            </div>
                          ) : (
                            `${r.employeeId?.name || "Unknown"} (${
                              r.employeeId?.nicNo || "N/A"
                            })`
                          )}
                        </li>
                      ))}
                    {record.records.filter((r) => r.status === "Present")
                      .length === 0 && (
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
                          {editMode ? (
                            <div className="edit-attendance">
                              <span>
                                {r.employeeId?.name || "Unknown"} (
                                {r.employeeId?.nicNo || "N/A"})
                              </span>
                              <div className="attendance-buttons">
                                <button
                                  type="button"
                                  className={`status-btn ${
                                    editedAttendance[r.employeeId._id] ===
                                    "Present"
                                      ? "present"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttendanceChange(
                                      r.employeeId._id,
                                      "Present"
                                    )
                                  }
                                >
                                  Present
                                </button>
                                <button
                                  type="button"
                                  className={`status-btn ${
                                    editedAttendance[r.employeeId._id] ===
                                    "Absent"
                                      ? "absent"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttendanceChange(
                                      r.employeeId._id,
                                      "Absent"
                                    )
                                  }
                                >
                                  Absent
                                </button>
                              </div>
                            </div>
                          ) : (
                            `${r.employeeId?.name || "Unknown"} (${
                              r.employeeId?.nicNo || "N/A"
                            })`
                          )}
                        </li>
                      ))}
                    {record.records.filter((r) => r.status === "Absent")
                      .length === 0 && (
                      <li className="no-data">No employees absent</li>
                    )}
                  </ul>
                </div>
                {editMode && (
                  <button
                    onClick={handleSaveChanges}
                    className="save-btn"
                    disabled={loading}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ViewAttendance;
