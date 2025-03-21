import React, { useState, useEffect } from "react";
import HRNav from "../HRNav/HRNav";
import "./HRDashboard.css";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";

function HRDashboard() {
  const [presentToday, setPresentToday] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [absentData, setAbsentData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/attendance");
        if (response.data.success) {
          const records = response.data.data;

          const today = new Date().toISOString().split("T")[0];
          const todayRecord = records.find(
            (record) => new Date(record.date).toISOString().split("T")[0] === today
          );
          const presentCount = todayRecord
            ? todayRecord.records.filter((r) => r.status === "Present").length
            : 0;
          setPresentToday(presentCount);

          const last7DaysPresent = [];
          const last7DaysAbsent = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const dayRecord = records.find(
              (r) => new Date(r.date).toISOString().split("T")[0] === dateStr
            );
            last7DaysPresent.push({
              date: dateStr,
              present: dayRecord ? dayRecord.records.filter((r) => r.status === "Present").length : 0,
            });
            last7DaysAbsent.push({
              date: dateStr,
              absent: dayRecord ? dayRecord.records.filter((r) => r.status === "Absent").length : 0,
            });
          }
          setAttendanceData(last7DaysPresent);
          setAbsentData(last7DaysAbsent);
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

  const maxPresent = Math.max(...attendanceData.map((d) => d.present), 1);
  const maxAbsent = Math.max(...absentData.map((d) => d.absent), 1);

  return (
    <div className="hrdashboard-home-container">
      <HeadBar />
      <div className="hrdashboard-layout">
        <div className="hrdashboard-sidebar">
          <HRNav />
        </div>
        <div className="hrdashboard-main-content">
          <div className="hrdashboard-content-wrapper">
            <h2 className="hrdashboard-title">Employee Management Center</h2>

            <div className="hrdashboard-present-box">
              <h3>Present Today ({new Date().toLocaleDateString()}):</h3>
              <p className="hrdashboard-present-count">{presentToday} Employees</p>
              {error && <p className="hrdashboard-error">{error}</p>}
            </div>

            <div className="hrdashboard-graphs-wrapper">
              <div className="hrdashboard-graph hrdashboard-present-graph">
                <h3>Present Employees (Last 7 Days)</h3>
                <div className="hrdashboard-graph-bars">
                  {attendanceData.length > 0 ? (
                    attendanceData.map((day, index) => {
                      const barHeight = maxPresent === 0 ? 0 : Math.max((day.present / maxPresent) * 180, 10);
                      return (
                        <div key={index} className="hrdashboard-bar-container">
                          <div
                            className="hrdashboard-bar hrdashboard-present-bar"
                            style={{ height: `${barHeight}px` }}
                          >
                            <span className="hrdashboard-bar-value">{day.present}</span>
                          </div>
                          <span className="hrdashboard-day-label">
                            {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </div>

              <div className="hrdashboard-graph hrdashboard-absent-graph">
                <h3>Absent Employees (Last 7 Days)</h3>
                <div className="hrdashboard-graph-bars">
                  {absentData.length > 0 ? (
                    absentData.map((day, index) => {
                      const barHeight = maxAbsent === 0 ? 0 : Math.max((day.absent / maxAbsent) * 180, 10);
                      return (
                        <div key={index} className="hrdashboard-bar-container">
                          <div
                            className="hrdashboard-bar hrdashboard-absent-bar"
                            style={{ height: `${barHeight}px` }}
                          >
                            <span className="hrdashboard-bar-value">{day.absent}</span>
                          </div>
                          <span className="hrdashboard-day-label">
                            {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;