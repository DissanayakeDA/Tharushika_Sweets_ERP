import React, { useState, useEffect } from "react";
import PMNav from "../PMNav/PMNav";
import "./PMDashboard.css";
import { Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function PMDashboard() {
  const [stats, setStats] = useState({
    pendingRequests: 0,
    approvedRequests: 0,
    totalIngredients: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestData, setRequestData] = useState({
    labels: [],
    datasets: [],
  });
  const [stockData, setStockData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch ingredient requests
        const requestsRes = await axios.get(
          "http://localhost:5000/api/ingredient-requests"
        );
        const requests = requestsRes.data.data || [];

        // Fetch ingredients
        const ingredientsRes = await axios.get(
          "http://localhost:5000/api/ingredients"
        );
        const ingredients = ingredientsRes.data.data || [];

        // Calculate stats
        const pendingRequests = requests.filter(
          (req) => req.status === "pending"
        ).length;
        const approvedRequests = requests.filter(
          (req) => req.status === "approved"
        ).length;
        const lowStockItems = ingredients.filter(
          (ing) => ing.ingredient_quantity < ing.min_quantity
        ).length;

        // Prepare request trend data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        }).reverse();

        const requestCounts = last7Days.map((day) => {
          return requests.filter(
            (req) =>
              new Date(req.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }) === day
          ).length;
        });

        setRequestData({
          labels: last7Days,
          datasets: [
            {
              label: "Ingredient Requests",
              data: requestCounts,
              borderColor: "#1976d2",
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        });

        // Prepare stock level data
        const topIngredients = ingredients
          .sort((a, b) => b.ingredient_quantity - a.ingredient_quantity)
          .slice(0, 5);

        setStockData({
          labels: topIngredients.map((ing) => ing.ingredient_name),
          datasets: [
            {
              label: "Current Stock",
              data: topIngredients.map((ing) => ing.ingredient_quantity),
              backgroundColor: "rgba(46, 125, 50, 0.6)",
              borderColor: "#2e7d32",
              borderWidth: 1,
            },
          ],
        });

        setStats({
          pendingRequests,
          approvedRequests,
          totalIngredients: ingredients.length,
          lowStockItems,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const requestChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ingredient Requests Trend (Last 7 Days)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const stockChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top 5 Ingredients by Stock Level",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="pm-dashboard-container">
      <HeadBar />
      <PMNav />

      <div className="pm-dashboard-content">
        <div className="pm-dashboard-header">
          <h2 className="pm-dashboard-title">Production Manager Dashboard</h2>
          <div className="pm-dashboard-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {loading ? (
          <div className="pm-loading-spinner">
            <div className="pm-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="pm-error-message">{error}</div>
        ) : (
          <>
            <div className="pm-stats-cards">
              <div className="pm-stat-card">
                <div className="pm-stat-icon">
                  <i className="bi bi-hourglass-split"></i>
                </div>
                <div className="pm-stat-info">
                  <h3>Pending Requests</h3>
                  <p>{stats.pendingRequests}</p>
                </div>
              </div>

              <div className="pm-stat-card">
                <div className="pm-stat-icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div className="pm-stat-info">
                  <h3>Approved Requests</h3>
                  <p>{stats.approvedRequests}</p>
                </div>
              </div>

              <div className="pm-stat-card">
                <div className="pm-stat-icon">
                  <i className="bi bi-box-seam"></i>
                </div>
                <div className="pm-stat-info">
                  <h3>Total Ingredients</h3>
                  <p>{stats.totalIngredients}</p>
                </div>
              </div>

              <div className="pm-stat-card">
                <div className="pm-stat-icon">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <div className="pm-stat-info">
                  <h3>Low Stock Items</h3>
                  <p>{stats.lowStockItems}</p>
                </div>
              </div>
            </div>

            <div className="pm-dashboard-charts">
              <div className="pm-chart-container">
                <Line data={requestData} options={requestChartOptions} />
              </div>
              <div className="pm-chart-container">
                <Bar data={stockData} options={stockChartOptions} />
              </div>
            </div>

            <div className="pm-dashboard-buttons">
              <Link
                to="/view-ingredient-requests"
                className="pm-dashboard-button"
              >
                <div className="pm-button-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-list-task"
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
                </div>
                <div className="pm-button-text">
                  <h3>View Requests</h3>
                  <p>Check and manage ingredient requests</p>
                </div>
              </Link>

              <Link to="/pmviewproducts" className="pm-dashboard-button">
                <div className="pm-button-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-box-seam"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
                  </svg>
                </div>
                <div className="pm-button-text">
                  <h3>Product List</h3>
                  <p>View and manage product inventory</p>
                </div>
              </Link>

              <Link to="/ingredient-request" className="pm-dashboard-button">
                <div className="pm-button-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-cart-plus-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 0 0-1H9z" />
                  </svg>
                </div>
                <div className="pm-button-text">
                  <h3>Request Ingredient</h3>
                  <p>Create new ingredient requests</p>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PMDashboard;
