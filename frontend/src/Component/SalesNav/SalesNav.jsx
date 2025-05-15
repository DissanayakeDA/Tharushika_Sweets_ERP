import React, { useState } from "react";
import "./SalesNav.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SalesNav() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showUserName, setShowUserName] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const loggedInUserName = user.username || "Guest";

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    setShowUserName(false);
  };

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
        <div className="salesNav-username-display">
          Logged in as: <strong>{loggedInUserName}</strong>
        </div>
      )}

      <div className={`salesNav-sidenav ${isNavOpen ? "salesNav-open" : ""}`}>
        <ul>
          <li>
            <Link
              to="/salesdashboard"
              className={`salesNav-home-a ${
                activeLink === "/salesdashboard" ? "salesNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/salesdashboard")}
            >
              <button
                className={`salesNav-center-icon-btn ${
                  activeLink === "/salesdashboard" ? "salesNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="salesNav-bi salesNav-bi-house-door-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
              </button>
              <label className="salesNav-nav-label">Dashboard</label>
            </Link>
          </li>
          <hr className="salesNav-nav-hr" />
          <li>
            <Link
              to="/sales-request"
              className={`salesNav-home-a ${
                activeLink === "/sales-request" ? "salesNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/sales-request")}
            >
              <button
                className={`salesNav-center-icon-btn ${
                  activeLink === "/sales-request" ? "salesNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="salesNav-bi salesNav-bi-envelope-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                </svg>
              </button>
              <label className="salesNav-nav-label">Request Stock</label>
            </Link>
          </li>
          <hr className="salesNav-nav-hr" />
          <li>
            <Link
              to="/spissueitems"
              className={`salesNav-home-a ${
                activeLink === "/spissueitems" ? "salesNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/spissueitems")}
            >
              <button
                className={`salesNav-center-icon-btn ${
                  activeLink === "/spissueitems" ? "salesNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="salesNav-bi salesNav-bi-box-arrow-up"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-9zm-1-5A1.5 1.5 0 0 0 1 2.5v12A1.5 1.5 0 0 0 2.5 16h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 13.5 1h-11zM8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                  />
                </svg>
              </button>
              <label className="salesNav-nav-label">Issue Items</label>
            </Link>
          </li>
          <hr className="salesNav-nav-hr" />
          <li>
            <Link
              to="/addshops"
              className={`salesNav-home-a ${
                activeLink === "/addshops" ? "salesNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/addshops")}
            >
              <button
                className={`salesNav-center-icon-btn ${
                  activeLink === "/addshops" ? "salesNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="salesNav-bi salesNav-bi-shop"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h-4v-3z" />
                </svg>
              </button>
              <label className="salesNav-nav-label">Add Shops</label>
            </Link>
          </li>
          <hr className="salesNav-nav-hr" />
          <li>
            <Link
              to="/spreturns"
              className={`salesNav-home-a ${
                activeLink === "/spreturns" ? "salesNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/spreturns")}
            >
              <button
                className={`salesNav-center-icon-btn ${
                  activeLink === "/spreturns" ? "salesNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="salesNav-bi salesNav-bi-arrow-return-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"
                  />
                </svg>
              </button>
              <label className="salesNav-nav-label">Returns</label>
            </Link>
          </li>
          <hr className="salesNav-nav-hr" />
          <li>
            <Link
              to="/login"
              className={`salesNav-home-a ${
                activeLink === "/signout" ? "salesNav-active" : ""
              }`}
              onClick={() => {
                handleLinkClick("/signout");
                handleLogout();
              }}
            >
              <button
                className={`salesNav-center-icon-btn ${
                  activeLink === "/signout" ? "salesNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="salesNav-bi salesNav-bi-box-arrow-right"
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
              <label className="salesNav-nav-label">Sign Out</label>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SalesNav;
