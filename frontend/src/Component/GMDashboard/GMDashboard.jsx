import React from "react";
import GMNav from "../GMNav/GMNav";
import "./GMDashboard.css";
import { Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
function GMDashboard() {
  return (
    <div className="home-container">
      <HeadBar />
      <GMNav />

      {/* Main Content */}
      <div className="main-content">
        <br />
        <h2 className="dash-title-GM">General Manager Dashboard</h2>
        {/* Dashboard Buttons */}

        <div className="dashboard-buttons">
          <Link to="/viewstock-gm" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i class="bi bi-box-seam"></i>
              </div>
              <label className="dash-btn-text">Stocks</label>
            </div>
          </Link>
          <Link to="/viewbuyers-gm" className="dashboard-link">
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
