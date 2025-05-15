import React, { useState } from "react";
import "./HRNav.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function HRNav() {
  const [showUserName, setShowUserName] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const loggedInUserName = user.username || "Guest";

  const handleProfileClick = () => {
    setShowUserName(!showUserName);
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setShowUserName(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      {showUserName && (
        <div className="username-display">
          Logged in as: <strong>{loggedInUserName}</strong>
        </div>
      )}

      <div className="sidenav-hr open">
        <ul>
          <li>
            <Link
              to="/hrdashboard"
              className={`home-a ${
                activeLink === "/hrdashboard" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/hrdashboard")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/hrdashboard" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-house-door-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
              </button>
              <label className="nav-label">Dashboard</label>
            </Link>
          </li>
          <hr className="nav-hr" />
          <li>
            <Link
              to="/addemployee"
              className={`home-a ${
                activeLink === "/addemployee" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/addemployee")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/addemployee" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-person-plus-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  <path
                    fillRule="evenodd"
                    d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
                  />
                </svg>
              </button>
              <label className="nav-label">Add Employee</label>
            </Link>
          </li>
          <hr className="nav-hr" />
          <li>
            <Link
              to="/viewemployees"
              className={`home-a ${
                activeLink === "/viewemployees" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/viewemployees")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/viewemployees" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-people-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  <path
                    fillRule="evenodd"
                    d="M5.216 14A2.24 технологи 2.24 0 0 1 5 13c0-1.01.77-2.27 1.946-2.944.426-.233.85-.457 1.254-.68A3 3 0 0 1 8 8a3 3 0 0 1 0-6 3 3 0 0 1 .216 5.99c-.404.224-.828.447-1.254.68C5.77 9.27 5 10.99 5 13a2.24 2.24 0 0 1-.216 1z"
                  />
                </svg>
              </button>
              <label className="nav-label">View Employees</label>
            </Link>
          </li>
          <hr className="nav-hr" />
          <li>
            <Link
              to="/addattendance"
              className={`home-a ${
                activeLink === "/addattendance" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/addattendance")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/addattendance" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-calendar-check-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                </svg>
              </button>
              <label className="nav-label">Add Attendance</label>
            </Link>
          </li>
          <hr className="nav-hr" />
          <li>
            <Link
              to="/viewattendance"
              className={`home-a ${
                activeLink === "/viewattendance" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/viewattendance")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/viewattendance" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-list-check"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"
                  />
                </svg>
              </button>
              <label className="nav-label">View Attendance</label>
            </Link>
          </li>
          <hr className="nav-hr" />
          <li>
            <Link
              to="/Accessdashboard"
              className={`home-a ${
                activeLink === "/Accessdashboard" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/Accessdashboard")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/Accessdashboard" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-shield-lock-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24c.303-.143.662-.352 1.048-.625a11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.869C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 0-1.5 1.5v2a1.5 1.5 0 0 0 3 0v-2A1.5 1.5 0 0 0 8 5m-1 1.5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0z"
                  />
                </svg>
              </button>
              <label className="nav-label">Access Control</label>
            </Link>
          </li>
          <hr className="nav-hr" />
          <li>
            <Link
              to="/login"
              className={`home-a ${activeLink === "/login" ? "active" : ""}`}
              onClick={() => {
                handleLinkClick("/login");
                handleLogout();
              }}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/login" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-box-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                  />
                </svg>
              </button>
              <label className="nav-label">Sign Out</label>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HRNav;
