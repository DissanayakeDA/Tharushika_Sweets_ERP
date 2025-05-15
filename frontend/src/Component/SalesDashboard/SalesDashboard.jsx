import React, { useEffect, useState } from "react";
import SalesNav from "../SalesNav/SalesNav";
import "./SalesDashboard.css";
import { Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2";
import ChartJS from "../../utils/chartConfig";
import {
  Chart as ChartJS_old,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS_old.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SalesDashboard() {
  const [stockData, setStockData] = useState([]);
  const [topSalesData, setTopSalesData] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'
  const [salesData, setSalesData] = useState([]);
  const [returns, setReturns] = useState([]);

  // Function to get start date based on timeframe
  const getStartDate = (tf) => {
    const now = new Date();
    const startDate = new Date(now);
    if (tf === "day") {
      startDate.setHours(0, 0, 0, 0);
    } else if (tf === "week") {
      const day = startDate.getDay();
      const diff = startDate.getDate() - (day === 0 ? 6 : day - 1);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
    } else if (tf === "month") {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }
    return startDate;
  };

  // Function to calculate summary values based on timeframe
  const calculateSummaryValues = (sales, returns, tf) => {
    const startDate = getStartDate(tf);
    const filteredSales = sales.filter(
      (sale) => new Date(sale.date) >= startDate
    );
    const filteredReturns = returns.filter(
      (ret) => new Date(ret.date) >= startDate
    );

    return {
      totalSales: filteredSales.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      ),
      totalOrders: filteredSales.length,
      totalReturns: filteredReturns.length,
      products: stockData.length, // This remains constant as it's current stock
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch stock data
        const stockResponse = await axios.get(
          "http://localhost:5000/api/salesstocks"
        );
        if (stockResponse.data) {
          if (Array.isArray(stockResponse.data)) {
            setStockData(stockResponse.data);
          } else if (
            stockResponse.data.data &&
            Array.isArray(stockResponse.data.data)
          ) {
            setStockData(stockResponse.data.data);
          } else if (
            stockResponse.data.stocks &&
            Array.isArray(stockResponse.data.stocks)
          ) {
            setStockData(stockResponse.data.stocks);
          } else {
            setError("Invalid stock data format received from server");
            setStockData([]);
          }
        }

        // Fetch sales data
        const salesResponse = await axios.get(
          "http://localhost:5000/api/indirectsales"
        );
        if (salesResponse.data.success) {
          const sales = salesResponse.data.sales;
          setSalesData(sales);

          // Fetch returns data
          const returnsResponse = await axios.get(
            "http://localhost:5000/api/indirectreturns"
          );
          if (returnsResponse.data) {
            if (Array.isArray(returnsResponse.data)) {
              setReturns(returnsResponse.data);
            } else if (returnsResponse.data.returns) {
              setReturns(returnsResponse.data.returns);
            } else {
              setError("Invalid returns data format received from server");
              setReturns([]);
            }
          }

          // Calculate topSalesData
          const startDate = getStartDate(timeframe);
          const filteredSales = sales.filter(
            (sale) => new Date(sale.date) >= startDate
          );

          const productSales = {};
          filteredSales.forEach((sale) => {
            sale.items.forEach((item) => {
              if (!productSales[item.itemName]) {
                productSales[item.itemName] = { sales: 0, revenue: 0 };
              }
              productSales[item.itemName].sales += item.quantity;
              productSales[item.itemName].revenue += item.total;
            });
          });
          const topSalesArray = Object.entries(productSales).map(
            ([name, data]) => ({ name, ...data })
          );
          topSalesArray.sort((a, b) => b.sales - a.sales);
          const top5Sales = topSalesArray.slice(0, 5);
          setTopSalesData(top5Sales);

          // Calculate dailySalesData based on selected timeframe
          const today = new Date();
          const daysToShow =
            timeframe === "day" ? 1 : timeframe === "week" ? 7 : 30;
          const dailyTotals = {};

          // Initialize daily totals for the selected period
          for (let i = 0; i < daysToShow; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split("T")[0];
            dailyTotals[dateString] = 0;
          }

          // Filter sales for the selected period
          const periodSales = sales.filter(
            (sale) => new Date(sale.date) >= startDate
          );

          // Calculate daily totals
          periodSales.forEach((sale) => {
            const saleDate = new Date(sale.date).toISOString().split("T")[0];
            if (dailyTotals[saleDate] !== undefined) {
              dailyTotals[saleDate] += sale.totalAmount;
            }
          });

          const totalPeriodSales = Object.values(dailyTotals).reduce(
            (sum, val) => sum + val,
            0
          );
          const labels = Object.keys(dailyTotals)
            .sort()
            .map((date) => {
              const d = new Date(date);
              return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            });
          const data = Object.values(dailyTotals).map((amount) =>
            totalPeriodSales > 0 ? (amount / totalPeriodSales) * 100 : 0
          );
          setDailySalesData({ labels, data });
        } else {
          setError("Failed to fetch sales data");
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  // Calculate summary values based on current timeframe
  const summaryValues = calculateSummaryValues(salesData, returns, timeframe);

  // Stock distribution chart data
  const pieChartData = {
    labels: stockData.map((item) => item.sp_name || item.name || "Unknown"),
    datasets: [
      {
        data: stockData.map((item) => item.sp_quantity || item.quantity || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8AC926",
          "#1982C4",
          "#6A4C93",
          "#F45B69",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  // Top sales items chart data
  const barChartData = {
    labels: topSalesData.map((item) => item.name),
    datasets: [
      {
        label: "Sales",
        data: topSalesData.map((item) => item.sales),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Daily sales chart data
  const lineChartData = {
    labels: dailySalesData.labels,
    datasets: [
      {
        label: "Daily Sales (%)",
        data: dailySalesData.data,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const datasetLabel = context.dataset.label || "";

            if (context.chart.config.type === "pie") {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }

            return `${datasetLabel}: ${value}%`;
          },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: "Top Selling Products",
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: "Daily Sales",
      },
    },
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: "Inventory Distribution",
      },
    },
  };

  return (
    <div className="salesdash-container">
      <HeadBar />
      <SalesNav />

      <div className="salesdash-main-content">
        <div className="salesdash-header">
          <h2 className="salesdash-title">Sales Management Dashboard</h2>

          <div className="salesdash-timeframe-selector">
            <button
              className={`salesdash-timeframe-btn ${
                timeframe === "day" ? "active" : ""
              }`}
              onClick={() => setTimeframe("day")}
            >
              <span>Today</span>
            </button>
            <button
              className={`salesdash-timeframe-btn ${
                timeframe === "week" ? "active" : ""
              }`}
              onClick={() => setTimeframe("week")}
            >
              <span>This Week</span>
            </button>
            <button
              className={`salesdash-timeframe-btn ${
                timeframe === "month" ? "active" : ""
              }`}
              onClick={() => setTimeframe("month")}
            >
              <span>This Month</span>
            </button>
          </div>
        </div>

        <div className="salesdash-stats-cards">
          <div className="salesdash-stat-card">
            <div className="salesdash-stat-icon">
              <i className="bi bi-currency-dollar"></i>
            </div>
            <div className="salesdash-stat-info">
              <h3>Total Sales</h3>
              <p>${summaryValues.totalSales.toFixed(2)}</p>
            </div>
          </div>

          <div className="salesdash-stat-card">
            <div className="salesdash-stat-icon">
              <i className="bi bi-cart-check"></i>
            </div>
            <div className="salesdash-stat-info">
              <h3>Sales</h3>
              <p>{summaryValues.totalOrders}</p>
            </div>
          </div>

          <div className="salesdash-stat-card">
            <div className="salesdash-stat-icon">
              <i className="bi bi-box-seam"></i>
            </div>
            <div className="salesdash-stat-info">
              <h3>Products</h3>
              <p>{summaryValues.products}</p>
            </div>
          </div>

          <div className="salesdash-stat-card">
            <div className="salesdash-stat-icon">
              <i className="bi bi-arrow-return-left"></i>
            </div>
            <div className="salesdash-stat-info">
              <h3>Returns</h3>
              <p>{summaryValues.totalReturns}</p>
            </div>
          </div>
        </div>

        <div className="salesdash-buttons">
          <Link to="/viewsalesstock" className="salesdash-link">
            <div className="salesdash-btn">
              <div className="salesdash-btn-icon">
                <i className="bi bi-house-door-fill"></i>
              </div>
              <div className="salesdash-btn-content">
                <label className="salesdash-btn-text">Stocks</label>
                <span className="salesdash-btn-description">
                  Manage inventory levels
                </span>
              </div>
              <div className="salesdash-btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
              <div className="salesdash-count-badge">{stockData.length}</div>
            </div>
          </Link>

          <Link to="/viewsalesrequests" className="salesdash-link">
            <div className="salesdash-btn">
              <div className="salesdash-btn-icon">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div className="salesdash-btn-content">
                <label className="salesdash-btn-text">Requests</label>
                <span className="salesdash-btn-description">
                  View and process requests
                </span>
              </div>
              <div className="salesdash-btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
              <div className="salesdash-count-badge-s">12</div>
            </div>
          </Link>

          <Link to="/spsales" className="salesdash-link">
            <div className="salesdash-btn">
              <div className="salesdash-btn-icon">
                <i className="bi bi-box-arrow-up"></i>
              </div>
              <div className="salesdash-btn-content">
                <label className="salesdash-btn-text">Sales</label>
                <span className="salesdash-btn-description">
                  Track sales progress
                </span>
              </div>
              <div className="salesdash-btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
              <div className="salesdash-count-badge-s">
                {summaryValues.totalOrders}
              </div>
            </div>
          </Link>

          <Link to="/spviewproduct" className="salesdash-link">
            <div className="salesdash-btn">
              <div className="salesdash-btn-icon">
                <i className="bi bi-gear-fill"></i>
              </div>
              <div className="salesdash-btn-content">
                <label className="salesdash-btn-text">Products</label>
                <span className="salesdash-btn-description">
                  Manage product catalog
                </span>
              </div>
              <div className="salesdash-btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>

          <Link to="/manageshops" className="salesdash-link">
            <div className="salesdash-btn">
              <div className="salesdash-btn-icon">
                <i className="bi bi-shop"></i>
              </div>
              <div className="salesdash-btn-content">
                <label className="salesdash-btn-text">Shops</label>
                <span className="salesdash-btn-description">
                  Manage retail locations
                </span>
              </div>
              <div className="salesdash-btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>

          <Link to="/spviewreturns" className="salesdash-link">
            <div className="salesdash-btn">
              <div className="salesdash-btn-icon">
                <i className="bi bi-arrow-return-left"></i>
              </div>
              <div className="salesdash-btn-content">
                <label className="salesdash-btn-text">Returns</label>
                <span className="salesdash-btn-description">
                  Process product returns
                </span>
              </div>
              <div className="salesdash-btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
              <div className="salesdash-count-badge-r">
                {summaryValues.totalReturns}
              </div>
            </div>
          </Link>
        </div>

        <div className="salesdash-grid">
          <div className="salesdash-chart-card compact">
            <div className="salesdash-chart-header">
              <h3>Inventory Distribution</h3>
              <div className="salesdash-chart-actions">
                <button className="salesdash-refresh-btn">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
            <p className="salesdash-chart-description">
              Current stock distribution by product category
            </p>
            <div className="salesdash-chart-container">
              {loading ? (
                <div className="salesdash-loading-spinner">
                  <div className="salesdash-spinner"></div>
                  <p>Loading inventory data...</p>
                </div>
              ) : error ? (
                <div className="salesdash-no-data-message">
                  <i className="bi bi-exclamation-triangle"></i>
                  <p>{error}</p>
                </div>
              ) : stockData.length > 0 ? (
                <Pie data={pieChartData} options={pieOptions} />
              ) : (
                <div className="salesdash-no-data-message">
                  <i className="bi bi-inbox"></i>
                  <p>No inventory data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="salesdash-chart-card compact">
            <div className="salesdash-chart-header">
              <h3>Top Selling Products</h3>
              <div className="salesdash-chart-actions">
                <button className="salesdash-refresh-btn">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
            <p className="salesdash-chart-description">
              Best performing products by sales volume
            </p>
            <div className="salesdash-chart-container">
              {loading ? (
                <div className="salesdash-loading-spinner">
                  <div className="salesdash-spinner"></div>
                  <p>Loading sales data...</p>
                </div>
              ) : topSalesData.length > 0 ? (
                <Bar data={barChartData} options={barOptions} />
              ) : (
                <div className="salesdash-no-data-message">
                  <i className="bi bi-inbox"></i>
                  <p>No sales data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="salesdash-chart-card compact">
            <div className="salesdash-chart-header">
              <h3>Daily Sales</h3>
              <div className="salesdash-chart-actions">
                <button className="salesdash-refresh-btn">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
            <p className="salesdash-chart-description">
              Sales performance over the past week
            </p>
            <div className="salesdash-chart-container">
              {loading ? (
                <div className="salesdash-loading-spinner">
                  <div className="salesdash-spinner"></div>
                  <p>Loading daily sales data...</p>
                </div>
              ) : dailySalesData.labels ? (
                <Line data={lineChartData} options={lineOptions} />
              ) : (
                <div className="salesdash-no-data-message">
                  <i className="bi bi-inbox"></i>
                  <p>No daily sales data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesDashboard;
