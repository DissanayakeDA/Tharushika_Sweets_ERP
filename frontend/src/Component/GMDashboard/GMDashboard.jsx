import React from "react";
import GMNav from "../GMNav/GMNav";
import "./GMDashboard.css";
import { Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
function GMDashboard() {
  return (
    <div className="home-container-gm">
      <HeadBar />
      <GMNav />

      {/* Main Content */}
      <div className="main-content-gm">
        <br />
        <h2 className="dash-title-GM">General Manager Dashboard</h2>
        {/* Dashboard Buttons */}

        <div className="dashboard-buttons">
          <Link to="/viewstock-gm" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i class="bi bi-box-seam-fill"></i>
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

          <Link to="/GMviewsales" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-cash-stack"></i>
              </div>

              <label className="dash-btn-text-sales"> Sales</label>
            </div>
          </Link>
          <Link to="/GMviewproducts" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon">
                <i className="bi bi-inboxes-fill"></i>
              </div>
              <label className="dash-btn-text-req">Products</label>
            </div>
          </Link>
        </div>
        <Link to="/GMviewemployee" className="dashboard-link-emp">
          <div className="dashboard-btn-emp">
            <div className="dash-btn-icon">
              <i className="bi bi-person-vcard-fill"></i>
            </div>
            <label className="dash-btn-text-req">Employees</label>
          </div>
        </Link>
        <Link to="/viewsuppliers" className="dashboard-link-emp">
          <div className="dashboard-btn-emp">
            <div className="dash-btn-icon">
              <i className="bi bi-person-lines-fill"></i>
            </div>
            <label className="dash-btn-text-req">Suppliers</label>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default GMDashboard;
