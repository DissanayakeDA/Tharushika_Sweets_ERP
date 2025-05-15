import React, { useState } from "react";
import "./HeadBar.css";
import { useNavigate } from "react-router-dom";

function HeadBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const loggedInUserName = user.username || "Guest";

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showModulesMenu) setShowModulesMenu(false);
  };

  const toggleModulesMenu = () => {
    setShowModulesMenu(!showModulesMenu);
    if (showUserMenu) setShowUserMenu(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="erp-headbar">
      <div className="erp-headbar-content">
        <div className="erp-branding">
          <div className="erp-company-logo">TS</div>
          <h2 className="erp-company-name">THARUSHIKA SWEETS PVT(LTD)</h2>
        </div>

        <div className="erp-header-actions">
          <div className="erp-notification-icon">
            <span className="erp-bell-icon">🔔</span>
            <span className="erp-notification-badge">3</span>
          </div>

          <div className="erp-user-profile">
            <div className="erp-user-avatar" onClick={toggleUserMenu}>
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
            </div>

            {showUserMenu && (
              <div className="erp-dropdown-menu erp-user-menu">
                <div className="erp-user-info">
                  <div className="erp-user-name">
                    Logged in as: {loggedInUserName}
                  </div>
                  <div className="erp-user-role">Administrator</div>
                </div>
                <div className="erp-menu-divider"></div>
                <div
                  className="erp-dropdown-item erp-logout"
                  onClick={handleLogout}
                >
                  <span className="erp-menu-icon">🚪</span>
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeadBar;
