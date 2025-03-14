import React from "react";
import Nav from "../Nav/Nav";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <Nav />

      {/* Main Content */}
      <div className="main-content">
        <h2 className="dash-title">Stock Manager Dashboard</h2>
        <hr className="hr-dash" />

        {/* Dashboard Buttons */}
        <div className="dashboard-buttons">
          <Link to="/viewstocks" className="dashboard-link">
            <div className="dashboard-btn">
            <div className="dash-btn-icon"><i class="bi bi-box-seam"></i></div>
              <label className="dash-btn-text">Stocks</label>
            </div>
          </Link>
          <Link to="/viewbuyers" className="dashboard-link">
          <div className="dashboard-btn">
            <div className="dash-btn-icon"><i className="bi bi-people-fill"></i></div>
              <label className="dash-btn-text"> Buyers</label>
          </div>
          </Link>
          
          <Link to="/viewsales" className="dashboard-link">
            <div className="dashboard-btn">
              <div className="dash-btn-icon"><i className="bi bi-receipt"></i></div>
              
              <label className="dash-btn-text-sales"> Sales</label>
            </div>
          </Link>
          <Link to="/viewrequests" className="dashboard-link">
            <div className="dashboard-btn">
            <div className="dash-btn-icon"><i className="bi bi-bell"></i></div>
              <label className="dash-btn-text-req">Requests</label>
            </div>
          </Link>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
