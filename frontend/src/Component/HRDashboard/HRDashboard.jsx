// client/src/Component/HRDashboard/HRDashboard.jsx
import React, { useState, useEffect } from "react";
import HRNav from "../HRNav/HRNav";
import "./HRDashboard.css";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";

function HRDashboard() {
  const [presentToday, setPresentToday] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch attendance data on mount
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attendance");
        if (response.data.success) {
          const records = response.data.data;

          // Calculate today's present count
          const today = new Date().toISOString().split("T")[0];
          const todayRecord = records.find(
            (record) => new Date(record.date).toISOString().split("T")[0] === today
          );
          const presentCount = todayRecord
            ? todayRecord.records.filter((r) => r.status === "Present").length
            : 0;
          setPresentToday(presentCount);

          // Aggregate present employees by day (last 7 days for simplicity)
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const dayRecord = records.find(
              (r) => new Date(r.date).toISOString().split("T")[0] === dateStr
            );
            last7Days.push({
              date: dateStr,
              present: dayRecord ? dayRecord.records.filter((r) => r.status === "Present").length : 0,
            });
          }
          setAttendanceData(last7Days);
        } else {
          setError("Failed to fetch attendance data.");
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setError("Error fetching attendance data.");
      }
    };
    fetchAttendance();
  }, []);

  // Calculate max present count for graph scaling
  const maxPresent = Math.max(...attendanceData.map((d) => d.present), 1) || 1;

  return (
    <div className="home-container">
      <HeadBar /> {/* Fixed header */}
      <div className="dashboard-layout">
        {/* Left Sidebar: Nav */}
        <div className="left-sidebar">
          <HRNav />
        </div>

        {/* Centered Main Content */}
        <div className="main-content">
          <div className="content-wrapper">
            <h2 className="dash-title-HR">Employee Management Center</h2>

            {/* Today's Present Count in a Box */}
            <div className="present-today-box">
              <h3>Present Today ({new Date().toLocaleDateString()}):</h3>
              <p className="present-count">{presentToday} Employees</p>
              {error && <p className="error-text">{error}</p>}
            </div>

            {/* Graph of Present Employees by Day */}
            <div className="attendance-graph">
              <h3>Present Employees (Last 7 Days)</h3>
              <div className="graph-container">
                {attendanceData.map((day, index) => (
                  <div key={index} className="graph-bar-container">
                    <div
                      className="graph-bar"
                      style={{ height: `${(day.present / maxPresent) * 100}%` }}
                    >
                      <span className="bar-label">{day.present}</span>
                    </div>
                    <span className="date-label">
                      {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;