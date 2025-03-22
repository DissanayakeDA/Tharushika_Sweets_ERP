import React from "react";
import SalesNav from "../SalesNav/SalesNav";
import "./SalesDashboard.css";
import { Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";

function SalesDashboard() {
  return (
    <div className="sales-container">
      <HeadBar />
      <SalesNav />

      <div className="main-content">
        <h2 className="dash-title">Sales Management Dashboard</h2>

        <div className="dashboard-buttons">
          <Link to="/salesdashboard" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-house-door-fill"></i>
              </div>
              <label className="dash-btn-text">Overview</label>
            </div>
          </Link>

          <Link to="/requests" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <label className="dash-btn-text">Requests</label>
            </div>
          </Link>

          <Link to="/issueitems" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-box-arrow-up"></i>
              </div>
              <label className="dash-btn-text">Issue Items</label>
            </div>
          </Link>

          <Link to="/manageitems" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-gear-fill"></i>
              </div>
              <label className="dash-btn-text">Manage Items</label>
            </div>
          </Link>
        </div>

        <Link to="/manageshops" className="dashboard-link">
          <div className="dashboard-btn-returns">
            <div className="dash-btn-icon-returns">
              <i className="bi bi-shop"></i>
            </div>
            <label className="dash-btn-text-req">Manage Shops</label>
          </div>
        </Link>

        <Link to="/returns" className="dashboard-link">
          <div className="dashboard-btn-returns">
            <div className="dash-btn-icon-returns">
              <i className="bi bi-arrow-return-left"></i>
            </div>
            <label className="dash-btn-text-req">Returns</label>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SalesDashboard;