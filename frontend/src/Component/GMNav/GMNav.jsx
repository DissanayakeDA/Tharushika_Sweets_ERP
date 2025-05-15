import React, { useState, useEffect } from "react";
import "./GMNav.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function GMNav() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [requestCount, setRequestCount] = useState(0);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  // Fetch the count of pending stock change requests
  useEffect(() => {
    const fetchRequestCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/stock-change-requests/pending"
        );
        if (response.data.success) {
          setRequestCount(response.data.data.length);
        }
      } catch (error) {
        console.error("Error fetching request count:", error);
      }
    };

    fetchRequestCount();
  }, []);

  return (
    <div>
      <div className={`GMNav-sidenav-gm ${isNavOpen ? "GMNav-open" : ""}`}>
        <ul>
          <li>
            <Link
              to="/home-gm"
              className={`GMNav-home-a ${
                activeLink === "/home-gm" ? "GMNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/home-gm")}
            >
              <button
                className={`GMNav-center-icon-btn ${
                  activeLink === "/home-gm" ? "GMNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="GMNav-bi GMNav-bi-house-door-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
              </button>
              <label className="GMNav-nav-label">Dashboard</label>
            </Link>
          </li>

          <li>
            <Link
              to="/addsuppliers"
              className={`GMNav-home-a ${
                activeLink === "/addsuppliers" ? "GMNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/addsuppliers")}
            >
              <button
                className={`GMNav-center-icon-btn ${
                  activeLink === "/addsuppliers" ? "GMNav-active" : ""
                }`}
              >
                <svg
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="GMNav-bi GMNav-bi-plus-square-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
                </svg>
              </button>
              <label className="GMNav-nav-label">Manage Supplier</label>
            </Link>
          </li>

          <li>
            <Link
              to="/all-stock-change-requests"
              className={`GMNav-home-a ${
                activeLink === "/all-stock-change-requests"
                  ? "GMNav-active"
                  : ""
              }`}
              onClick={() => handleLinkClick("/all-stock-change-requests")}
            >
              <div className="GMNav-icon-with-badge">
                <button
                  className={`GMNav-center-icon-btn ${
                    activeLink === "/all-stock-change-requests"
                      ? "GMNav-active"
                      : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    className="GMNav-bi GMNav-bi-bell-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                  </svg>
                </button>
                {requestCount > 0 && (
                  <span className="GMNav-request-count-badge">
                    {requestCount}
                  </span>
                )}
              </div>
              <label className="GMNav-nav-label">Requests</label>
            </Link>
          </li>

          <li>
            <Link
              to="/GMviewreturns"
              className={`GMNav-home-a ${
                activeLink === "/GMviewreturns" ? "GMNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/GMviewreturns")}
            >
              <button
                className={`GMNav-center-icon-btn ${
                  activeLink === "/GMviewreturns" ? "GMNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  fill="currentColor"
                  className="GMNav-bi GMNav-bi-arrow-clockwise"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                </svg>
              </button>
              <label className="GMNav-nav-label">Returns</label>
            </Link>
          </li>

          <li>
            <Link
              to="/Accessdashboard"
              className={`GMNav-home-a ${
                activeLink === "/Accessdashboard" ? "GMNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/Accessdashboard")}
            >
              <button
                className={`GMNav-center-icon-btn ${
                  activeLink === "/Accessdashboard" ? "GMNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="GMNav-bi GMNav-bi-shield-lock-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24c.303-.143.662-.352 1.048-.625a11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.869C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 0-1.5 1.5v2a1.5 1.5 0 0 0 3 0v-2A1.5 1.5 0 0 0 8 5m-1 1.5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0z"
                  />
                </svg>
              </button>
              <label className="GMNav-nav-label">Access Control</label>
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className={`GMNav-home-a ${
                activeLink === "/login" ? "GMNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/login")}
            >
              <button
                className={`GMNav-center-icon-btn ${
                  activeLink === "/login" ? "GMNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="GMNav-bi GMNav-bi-box-arrow-right"
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
              <label className="GMNav-nav-label">Sign Out</label>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GMNav;
