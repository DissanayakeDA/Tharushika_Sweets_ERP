import React, { useState } from "react";
import "./Nav.css";
import { Link, useLocation } from "react-router-dom";

function Nav() {
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
      <div className={`stockNav-sidenav ${isNavOpen ? "stockNav-open" : ""}`}>
        <ul>
          <li>
            <Link
              to="/mainhome"
              className={`stockNav-home-a ${
                activeLink === "/mainhome" ? "stockNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/mainhome")}
            >
              <button
                className={`stockNav-center-icon-btn ${
                  activeLink === "/mainhome" ? "stockNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="stockNav-bi stockNav-bi-house-door-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                </svg>
              </button>
              <label className="stockNav-nav-label">Dashboard</label>
            </Link>
          </li>
          <hr className="stockNav-nav-hr" />
          <li>
            <Link
              to="/addstock"
              className={`stockNav-home-a ${
                activeLink === "/addstock" ? "stockNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/addstock")}
            >
              <button
                className={`stockNav-center-icon-btn ${
                  activeLink === "/addstock" ? "stockNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="stockNav-bi stockNav-bi-archive-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                </svg>
              </button>
              <label className="stockNav-nav-label">Add Stock</label>
            </Link>
          </li>
          <hr className="stockNav-nav-hr" />
          <li>
            <Link
              to="/issueitems"
              className={`stockNav-home-a ${
                activeLink === "/issueitems" ? "stockNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/issueitems")}
            >
              <button
                className={`stockNav-center-icon-btn ${
                  activeLink === "/issueitems" ? "stockNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="stockNav-bi stockNav-bi-cart-check-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708" />
                </svg>
              </button>
              <label className="stockNav-nav-label">Issue Items</label>
            </Link>
          </li>
          <hr className="stockNav-nav-hr" />
          <li>
            <Link
              to="/addbuyers"
              className={`stockNav-home-a ${
                activeLink === "/addbuyers" ? "stockNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/addbuyers")}
            >
              <button
                className={`stockNav-center-icon-btn ${
                  activeLink === "/addbuyers" ? "stockNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="stockNav-bi stockNav-bi-plus-square-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
                </svg>
              </button>
              <label className="stockNav-nav-label">Add Buyers</label>
            </Link>
          </li>
          <hr className="stockNav-nav-hr" />
          <li>
            <Link
              to="/directreturns"
              className={`stockNav-home-a ${
                activeLink === "/directreturns" ? "stockNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/directreturns")}
            >
              <button
                className={`stockNav-center-icon-btn ${
                  activeLink === "/directreturns" ? "stockNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  fill="currentColor"
                  className="stockNav-bi stockNav-bi-arrow-clockwise"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                </svg>
              </button>
              <label className="stockNav-nav-label">Returns</label>
            </Link>
          </li>
          <hr className="stockNav-nav-hr" />
          <li>
            <Link
              to="/login"
              className={`stockNav-home-a ${
                activeLink === "/login" ? "stockNav-active" : ""
              }`}
              onClick={() => handleLinkClick("/signout")}
            >
              <button
                className={`stockNav-center-icon-btn ${
                  activeLink === "/login" ? "stockNav-active" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  fill="currentColor"
                  className="stockNav-bi stockNav-bi-box-arrow-right"
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
              <label className="stockNav-nav-label">Sign Out</label>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
