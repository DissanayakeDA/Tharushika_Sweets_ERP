import React, { useState, useEffect } from "react";
import HRNav from "../HRNav/HRNav";
import "./HRDashboard.css";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";

function HRDashboard() {
  const [presentToday, setPresentToday] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [absentData, setAbsentData] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/attendance"
        );
        if (response.data.success) {
          const records = response.data.data;

          const today = new Date().toISOString().split("T")[0];
          const todayRecord = records.find(
            (record) =>
              new Date(record.date).toISOString().split("T")[0] === today
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
              present: dayRecord
                ? dayRecord.records.filter((r) => r.status === "Present").length
                : 0,
            });

            last7DaysAbsent.push({
              date: dateStr,
              absent: dayRecord
                ? dayRecord.records.filter((r) => r.status === "Absent").length
                : 0,
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
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employee");
        if (response.data.success) {
          const employees = response.data.data;
          setTotalEmployees(employees.length);

          const today = new Date();
          const next30Days = new Date();
          next30Days.setDate(today.getDate() + 30);

          const upcoming = employees
            .map((employee) => {
              const birthDate = new Date(employee.dateOfBirth);
              const nextBirthday = new Date(
                today.getFullYear(),
                birthDate.getMonth(),
                birthDate.getDate()
              );
              if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
              }
              return {
                ...employee,
                nextBirthday,
                daysUntil: Math.ceil(
                  (nextBirthday - today) / (1000 * 60 * 60 * 24)
                ),
              };
            })
            .filter(
              (employee) =>
                employee.nextBirthday >= today &&
                employee.nextBirthday <= next30Days
            )
            .sort((a, b) => a.nextBirthday - b.nextBirthday);

          setUpcomingBirthdays(upcoming);
        } else {
          setError("Failed to fetch employee data.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Error fetching employee data.");
      }
    };

    fetchAttendance();
    fetchEmployeeData();
  }, []);

  const maxPresent = Math.max(...attendanceData.map((d) => d.present), 1);
  const maxAbsent = Math.max(...absentData.map((d) => d.absent), 1);

  const getAttendanceRate = () => {
    if (totalEmployees === 0) return 0;
    return Math.round((presentToday / totalEmployees) * 100);
  };

  const getAbsentRate = () => {
    if (totalEmployees === 0) return 0;
    return Math.round(((totalEmployees - presentToday) / totalEmployees) * 100);
  };

  return (
    <div className="hrdashboard-home-container">
      <div className="headbar-wrapper">
        <HeadBar />
      </div>
      <div className="hrdashboard-layout">
        <div className="hrdashboard-sidebar">
          <div className="hrnav-wrapper">
            <HRNav />
          </div>
        </div>
        <div className="hrdashboard-main-content">
          <div className="hrdashboard-content-wrapper hrdashboard-content">
            <header className="hrdashboard-header">
              <h1 className="hrdashboard-title">HR Dashboard</h1>
              <p className="hrdashboard-date">
                📅{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </header>

            {isLoading ? (
              <div className="hrdashboard-loading">
                <div className="hrdashboard-loader"></div>
                <p>Loading dashboard data...</p>
              </div>
            ) : error ? (
              <div className="hrdashboard-error-container">
                <p className="hrdashboard-error">{error}</p>
              </div>
            ) : (
              <>
                <div className="hrdashboard-stats-grid">
                  <div className="hrdashboard-stat-card hrdashboard-present">
                    <div className="hrdashboard-stat-icon">✅</div>
                    <div className="hrdashboard-stat-content">
                      <h3>Present Today</h3>
                      <div className="hrdashboard-stat-numbers">
                        <span className="hrdashboard-stat-value">
                          {presentToday}
                        </span>
                        <span className="hrdashboard-stat-label">
                          / {totalEmployees}
                        </span>
                      </div>
                      <div className="hrdashboard-progress-bar">
                        <div
                          className="hrdashboard-progress-fill"
                          style={{ width: `${getAttendanceRate()}%` }}
                        ></div>
                      </div>
                      <span className="hrdashboard-stat-percentage">
                        {getAttendanceRate()}% Attendance Rate
                      </span>
                    </div>
                  </div>

                  <div className="hrdashboard-stat-card hrdashboard-absent">
                    <div className="hrdashboard-stat-icon">🚫</div>
                    <div className="hrdashboard-stat-content">
                      <h3>Absent Today</h3>
                      <div className="hrdashboard-stat-numbers">
                        <span className="hrdashboard-stat-value">
                          {totalEmployees - presentToday}
                        </span>
                        <span className="hrdashboard-stat-label">
                          / {totalEmployees}
                        </span>
                      </div>
                      <div className="hrdashboard-progress-bar">
                        <div
                          className="hrdashboard-progress-fill"
                          style={{ width: `${getAbsentRate()}%` }}
                        ></div>
                      </div>
                      <span className="hrdashboard-stat-percentage">
                        {getAbsentRate()}% Absence Rate
                      </span>
                    </div>
                  </div>

                  <div className="hrdashboard-stat-card hrdashboard-total">
                    <div className="hrdashboard-stat-icon">👥</div>
                    <div className="hrdashboard-stat-content">
                      <h3>Total Employees</h3>
                      <div className="hrdashboard-stat-numbers">
                        <span className="hrdashboard-stat-value">
                          {totalEmployees}
                        </span>
                      </div>
                      <span className="hrdashboard-stat-description">
                        Active workforce
                      </span>
                    </div>
                  </div>

                  <div className="hrdashboard-stat-card hrdashboard-birthdays">
                    <div className="hrdashboard-stat-icon">🎉</div>
                    <div className="hrdashboard-stat-content">
                      <h3>Upcoming Birthdays</h3>
                      <div className="hrdashboard-stat-numbers">
                        <span className="hrdashboard-stat-value">
                          {upcomingBirthdays.length}
                        </span>
                      </div>
                      <span className="hrdashboard-stat-description">
                        Next 30 days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hrdashboard-content-grid">
                  <div className="hrdashboard-main-section">
                    <div className="hrdashboard-graph-container">
                      <div className="hrdashboard-graph-header">
                        <h3>📈 Attendance Trends (Last 7 Days)</h3>
                      </div>
                      <div className="hrdashboard-graphs-wrapper">
                        <div className="hrdashboard-graph">
                          <h4>Present Employees</h4>
                          <div className="hrdashboard-graph-bars">
                            {attendanceData.map((day, index) => {
                              const barHeight =
                                maxPresent === 0
                                  ? 0
                                  : Math.max(
                                      (day.present / maxPresent) * 180,
                                      10
                                    );
                              return (
                                <div
                                  key={index}
                                  className="hrdashboard-bar-container"
                                >
                                  <div
                                    className="hrdashboard-bar hrdashboard-present-bar"
                                    style={{ height: `${barHeight}px` }}
                                  >
                                    <span className="hrdashboard-bar-value">
                                      {day.present}
                                    </span>
                                  </div>
                                  <span className="hrdashboard-day-label">
                                    {new Date(day.date).toLocaleDateString(
                                      "en-US",
                                      { weekday: "short" }
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="hrdashboard-graph">
                          <h4>Absent Employees</h4>
                          <div className="hrdashboard-graph-bars">
                            {absentData.map((day, index) => {
                              const barHeight =
                                maxAbsent === 0
                                  ? 0
                                  : Math.max(
                                      (day.absent / maxAbsent) * 180,
                                      10
                                    );
                              return (
                                <div
                                  key={index}
                                  className="hrdashboard-bar-container"
                                >
                                  <div
                                    className="hrdashboard-bar hrdashboard-absent-bar"
                                    style={{ height: `${barHeight}px` }}
                                  >
                                    <span className="hrdashboard-bar-value">
                                      {day.absent}
                                    </span>
                                  </div>
                                  <span className="hrdashboard-day-label">
                                    {new Date(day.date).toLocaleDateString(
                                      "en-US",
                                      { weekday: "short" }
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hrdashboard-birthday-tile">
                    <div className="hrdashboard-birthday-box">
                      <div className="hrdashboard-birthday-header">
                        🎂
                        <h3>Upcoming Birthdays</h3>
                      </div>
                      {upcomingBirthdays.length > 0 ? (
                        <ul className="hrdashboard-birthday-list">
                          {upcomingBirthdays.map((employee) => (
                            <li
                              key={employee._id}
                              className="hrdashboard-birthday-item"
                            >
                              <div className="hrdashboard-birthday-avatar">
                                {employee.name.charAt(0)}
                              </div>
                              <div className="hrdashboard-birthday-info">
                                <span className="hrdashboard-birthday-name">
                                  {employee.name}
                                </span>
                                <span className="hrdashboard-birthday-date">
                                  📅
                                  {new Date(
                                    employee.nextBirthday
                                  ).toLocaleDateString()}
                                  <span className="hrdashboard-birthday-days">
                                    {employee.daysUntil === 0 ? (
                                      <span className="hrdashboard-birthday-today">
                                        Today!
                                      </span>
                                    ) : (
                                      <>
                                        in {employee.daysUntil}{" "}
                                        {employee.daysUntil === 1
                                          ? "day"
                                          : "days"}
                                      </>
                                    )}
                                  </span>
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="hrdashboard-no-data">
                          No upcoming birthdays in the next 30 days.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
