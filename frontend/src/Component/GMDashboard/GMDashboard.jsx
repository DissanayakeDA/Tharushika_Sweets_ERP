import React from "react";
import Nav from "../Nav/Nav";
import "./GMDashboard.css";
import { Link } from "react-router-dom";

function GMDashboard() {
  return (
    <div className="home-container">
      <Nav />

      {/* Main Content */}
      <div className="main-content">
        <h2 className="dash-title">General Manager Dashboard</h2>
        <hr className="hr-dash" />

        {/* Dashboard Buttons */}
        <div className="dashboard-buttons">
          <Link to="/viewstocks" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i class="bi bi-box-seam"></i>
              </div>
              <label className="dash-btn-text">Stocks</label>
            </div>
          </Link>
          <Link to="/viewbuyers" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <label className="dash-btn-text"> Buyers</label>
            </div>
          </Link>

          <Link to="/viewsales" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-receipt"></i>
              </div>

              <label className="dash-btn-text-sales"> Sales</label>
            </div>
          </Link>
          <Link to="/viewrequests" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-bell"></i>
              </div>
              <label className="dash-btn-text-req">Requests</label>
            </div>
          </Link>
        </div>
        <Link to="/viewrequests" className="dashboard-link">
          <div className="dashboard-btn-emp">
            <div className="dash-btn-icon">
              <i className="bi bi-bell"></i>
            </div>
            <label className="dash-btn-text-req">Employees</label>
          </div>
        </Link>
        <Link to="/addsuppliers" className="dashboard-link">
          <div className="dashboard-btn-emp">
            <div className="dash-btn-icon">
              <i className="bi bi-bell"></i>
            </div>
            <label className="dash-btn-text-req">Supplier</label>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default GMDashboard;
