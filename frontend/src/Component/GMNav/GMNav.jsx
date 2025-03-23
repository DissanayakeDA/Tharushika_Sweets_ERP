import React, { useState } from "react";
import "./GMNav.css";
import { Link, useLocation } from "react-router-dom";

function GMNav() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div>
      <button className="profile-icon-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-person-circle"
          viewBox="0 0 16 16"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
      </button>
      <div className={`sidenav-gm ${isNavOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link
              to="/home-gm"
              className={`home-a ${activeLink === "/home-gm" ? "active" : ""}`}
              onClick={() => handleLinkClick("/home-gm")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/home-gm" ? "active" : ""
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
              to="/addsuppliers"
              className={`home-a ${
                activeLink === "/addsuppliers" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/addsuppliers")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/addsuppliers" ? "active" : ""
                }`}
              >
                <svg
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-plus-square-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
                </svg>
              </button>
              <label className="nav-label">Manage Supplier</label>
            </Link>
          </li>
          <hr className="nav-hr" />
          <li>
            <Link
              to="/GMviewrequests"
              className={`home-a ${
                activeLink === "/GMviewrequests" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/GMviewrequests")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/GMviewrequests" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  class="bi bi-bell-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                </svg>
              </button>
              <label className="nav-label">Requests</label>
            </Link>
          </li>
          <hr className="nav-hr" />

          <hr className="nav-hr" />
          <li>
            <Link
              to="/GMviewreturns"
              className={`home-a ${
                activeLink === "/GMviewreturns" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/GMviewreturns")}
            >
              <button
                className={`center-icon-btn ${
                  activeLink === "/GMviewreturns" ? "active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="bi bi-arrow-clockwise"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                </svg>
              </button>
              <label className="nav-label">Returns</label>
            </Link>
          </li>
          <hr className="nav-hr" />
          <li>
            <Link
              to="/login"
              className={`home-a ${activeLink === "/login" ? "active" : ""}`}
              onClick={() => handleLinkClick("/signout")}
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

export default GMNav;
