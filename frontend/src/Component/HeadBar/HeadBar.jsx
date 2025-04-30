import React, { useState } from "react";
import "./HeadBar.css";

function HeadBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModulesMenu, setShowModulesMenu] = useState(false);

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
              <span className="erp-user-initials">JS</span>
            </div>

            {showUserMenu && (
              <div className="erp-dropdown-menu erp-user-menu">
                <div className="erp-user-info">
                  <div className="erp-user-name">John Smith</div>
                  <div className="erp-user-role">Administrator</div>
                </div>
                <div className="erp-menu-divider"></div>
                <div className="erp-dropdown-item">
                  <span className="erp-menu-icon">👤</span>
                  <span>My Profile</span>
                </div>
                <div className="erp-dropdown-item">
                  <span className="erp-menu-icon">⚙️</span>
                  <span>Preferences</span>
                </div>
                <div className="erp-dropdown-item">
                  <span className="erp-menu-icon">🔑</span>
                  <span>Change Password</span>
                </div>
                <div className="erp-menu-divider"></div>
                <div className="erp-dropdown-item erp-logout">
                  <span className="erp-menu-icon">🚪</span>
                  <span>Logout</span>
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
