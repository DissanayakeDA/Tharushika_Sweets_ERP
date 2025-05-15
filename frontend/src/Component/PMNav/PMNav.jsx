import React, { useState } from "react";
import "./PMNav.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function PMNav() {
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
        <div className="pm-username-display">
          Logged in as: <strong>{loggedInUserName}</strong>
        </div>
      )}

      <div className={`pm-sidenav ${isNavOpen ? "pm-sidenav-open" : ""}`}>
        <ul className="pm-nav-list">
          <li className="pm-nav-item">
            <Link
              to="/pmdashboard"
              className={`pm-nav-link ${
                activeLink === "/pmdashboard" ? "pm-nav-active" : ""
              }`}
              onClick={() => handleLinkClick("/pmdashboard")}
            >
              <button
                className={`pm-center-icon-btn ${
                  activeLink === "/pmdashboard" ? "pm-btn-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="pm-bi-house-door-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
              </button>
              <label className="pm-nav-label">Dashboard</label>
            </Link>
          </li>
          <hr className="pm-nav-divider" />
          <li className="pm-nav-item">
            <Link
              to="/view-ingredient-requests"
              className={`pm-nav-link ${
                activeLink === "/view-ingredient-requests" ? "pm-nav-active" : ""
              }`}
              onClick={() => handleLinkClick("/view-ingredient-requests")}
            >
              <button
                className={`pm-center-icon-btn ${
                  activeLink === "/view-ingredient-requests" ? "pm-btn-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="pm-bi-list-task"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"
                  />
                  <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z" />
                  <path
                    fillRule="evenodd"
                    d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.1h1a.5.5 0 0 1 .5-.5V3a.5.5 0 0 1 .5-.5H2zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"
                  />
                </svg>
              </button>
              <label className="pm-nav-label">View Requests</label>
            </Link>
          </li>
          <hr className="pm-nav-divider" />
          <li className="pm-nav-item">
            <Link
              to="/pmviewproducts"
              className={`pm-nav-link ${
                activeLink === "/pmviewproducts" ? "pm-nav-active" : ""
              }`}
              onClick={() => handleLinkClick("/pmviewproducts")}
            >
              <button
                className={`pm-center-icon-btn ${
                  activeLink === "/pmviewproducts" ? "pm-btn-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="pm-bi-box-seam"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                </svg>
              </button>
              <label className="pm-nav-label">Product List</label>
            </Link>
          </li>
          <hr className="pm-nav-divider" />
          <li className="pm-nav-item">
            <Link
              to="/ingredient-request"
              className={`pm-nav-link ${
                activeLink === "/ingredient-request" ? "pm-nav-active" : ""
              }`}
              onClick={() => handleLinkClick("/ingredient-request")}
            >
              <button
                className={`pm-center-icon-btn ${
                  activeLink === "/ingredient-request" ? "pm-btn-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="pm-bi-cart-plus-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 0 0-1H9z" />
                </svg>
              </button>
              <label className="pm-nav-label">Request Ingredient</label>
            </Link>
          </li>
          <hr className="pm-nav-divider" />
          <li className="pm-nav-item">
            <Link
              to="/login"
              className={`pm-nav-link ${activeLink === "/signout" ? "pm-nav-active" : ""}`}
              onClick={() => {
                handleLinkClick("/signout");
                handleLogout();
              }}
            >
              <button
                className={`pm-center-icon-btn ${
                  activeLink === "/signout" ? "pm-btn-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="pm-bi-box-arrow-right"
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
              <label className="pm-nav-label">Sign Out</label>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PMNav;