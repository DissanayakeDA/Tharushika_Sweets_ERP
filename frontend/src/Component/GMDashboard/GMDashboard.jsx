import React, { useState, useEffect } from "react";
import GMNav from "../GMNav/GMNav";
import "./GMDashboard.css";
import { Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function GMDashboard() {
  // State management
  const [timeframe, setTimeframe] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [buyerCount, setBuyerCount] = useState(0);
  const [chartData, setChartData] = useState(null); // Sales Distribution
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [salesDistribution, setSalesDistribution] = useState(null); // Top Selling Items
  const [stockDistribution, setStockDistribution] = useState(null); // Stock Distribution
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    monthlySales: 0,
    yearlyGrowth: 0,
    operatingMargin: 0,
  });

  // Function to get the start and end dates based on selected timeframe
  const getDateRange = () => {
    const today = new Date();
    let startDate = new Date(today);
    const endDate = new Date(today);

    switch (timeframe) {
      case "week":
        const dayOfWeek = today.getDay();
        startDate.setDate(
          today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
        );
        break;
      case "month":
        startDate.setDate(today.getDate() - 30);
        break;
      case "year":
        startDate.setDate(today.getDate() - 365);
        break;
      default:
        startDate.setDate(today.getDate() - 7);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  // Helper function to get all dates in a range
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Fetch initial data including counts and summary stats on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const buyersRes = await axios.get("http://localhost:5000/buyers");
        const buyerCount =
          buyersRes.data && Array.isArray(buyersRes.data.buyers)
            ? buyersRes.data.buyers.length
            : 0;
        setBuyerCount(buyerCount);

        const productsRes = await axios.get(
          "http://localhost:5000/api/products"
        );
        const productCount =
          productsRes.data && Array.isArray(productsRes.data.data)
            ? productsRes.data.data.length
            : 0;
        setProductCount(productCount);

        const suppliersRes = await axios.get(
          "http://localhost:5000/api/suppliers"
        );
        const supplierCount =
          suppliersRes.data &&
          suppliersRes.data.success &&
          Array.isArray(suppliersRes.data.data)
            ? suppliersRes.data.data.length
            : 0;
        setSupplierCount(supplierCount);

        setEmployeeCount(48);

        // Fetch summary stats
        const summaryRes = await axios.get(
          "http://localhost:5000/api/summary-stats"
        );
        if (summaryRes.data.success) {
          setSummaryStats(summaryRes.data.stats);
        } else {
          setSummaryStats({
            totalRevenue: 546800,
            monthlySales: 78500,
            yearlyGrowth: 12.5,
            operatingMargin: 18.7,
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setBuyerCount(0);
        setProductCount(0);
        setSupplierCount(0);
        setEmployeeCount(48);
        setSummaryStats({
          totalRevenue: 546800,
          monthlySales: 78500,
          yearlyGrowth: 12.5,
          operatingMargin: 18.7,
        });
      }
    };

    fetchInitialData();
  }, []);

  // Function to fetch sales data for charts
  const fetchSalesDataForCharts = async () => {
    const { startDate, endDate } = getDateRange();
    const dateLabels =
      timeframe === "week"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : getDatesInRange(startDate, endDate).map((date) =>
            new Date(date).toLocaleDateString(
              "en-US",
              timeframe === "month"
                ? { month: "short", day: "numeric" }
                : { month: "short" }
            )
          );

    try {
      const response = await axios.get(
        `http://localhost:5000/api/sales?startDate=${startDate}&endDate=${endDate}`
      );

      if (response.data.success) {
        const sales = response.data.sales || [];

        // Sales Distribution Chart
        const dateRangeArray = getDatesInRange(startDate, endDate);
        const dailySales = {};
        dateRangeArray.forEach((day) => {
          dailySales[day] = 0;
        });

        sales.forEach((sale) => {
          const saleDate = new Date(sale.date).toISOString().split("T")[0];
          if (dailySales[saleDate] !== undefined) {
            dailySales[saleDate] += sale.totalAmount;
          }
        });

        const saleValues = Object.values(dailySales);
        const totalSales = saleValues.reduce((sum, val) => sum + val, 0);
        const dailyPercentages = saleValues.map((val) =>
          totalSales > 0 ? (val / totalSales) * 100 : 0
        );

        setChartData({
          labels: dateLabels,
          datasets: [
            {
              label: `Sales Percentage (${timeframe})`,
              data: dailyPercentages,
              backgroundColor: dateLabels.map(
                (_, i) =>
                  `rgba(${75 + i * 20}, ${192 - i * 10}, ${192 - i * 5}, 0.6)`
              ),
              borderColor: dateLabels.map(
                (_, i) =>
                  `rgba(${75 + i * 20}, ${192 - i * 10}, ${192 - i * 5}, 1)`
              ),
              borderWidth: 1,
            },
          ],
        });

        // Top Selling Items Chart - Get actual product sales data
        const itemSalesMap = {};

        // Process sales data to extract items sold
        sales.forEach((sale) => {
          if (sale.items && Array.isArray(sale.items)) {
            sale.items.forEach((item) => {
              if (item.itemName) {
                itemSalesMap[item.itemName] =
                  (itemSalesMap[item.itemName] || 0) +
                  Number(item.quantity || 0);
              }
            });
          }
        });

        // If no real data found, fetch from a dedicated endpoint
        if (Object.keys(itemSalesMap).length === 0) {
          try {
            const topProductsRes = await axios.get(
              "http://localhost:5000/api/sales"
            );
            if (
              topProductsRes.data.success &&
              Array.isArray(topProductsRes.data.data)
            ) {
              topProductsRes.data.data.forEach((product) => {
                itemSalesMap[product.productName] = product.salesCount;
              });
            }
          } catch (topProductsError) {
            console.error("Error fetching top products:", topProductsError);
            // Fallback to demo data
            itemSalesMap["Product A"] = 145;
            itemSalesMap["Product B"] = 132;
            itemSalesMap["Product C"] = 121;
            itemSalesMap["Product D"] = 87;
            itemSalesMap["Product E"] = 65;
          }
        }

        const sortedItems = Object.entries(itemSalesMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        // Set top selling items for both chart and details view
        setTopSellingItems(sortedItems);

        // Set the sales distribution data for the doughnut chart
        setSalesDistribution({
          labels: sortedItems.map((item) => item[0]),
          datasets: [
            {
              label: "Units Sold",
              data: sortedItems.map((item) => item[1]),
              backgroundColor: sortedItems.map(
                (_, i) =>
                  `hsla(${(i * 360) / sortedItems.length}, 70%, 50%, 0.7)`
              ),
              borderColor: sortedItems.map(
                (_, i) => `hsl(${(i * 360) / sortedItems.length}, 70%, 40%)`
              ),
              borderWidth: 1,
            },
          ],
        });
      } else {
        // Handle API response with no success - use demo data
        console.warn("API returned no success status, using demo data");
        const demoItems = [
          ["Product A", 145],
          ["Product B", 132],
          ["Product C", 121],
          ["Product D", 87],
          ["Product E", 65],
        ];

        setTopSellingItems(demoItems);
        setSalesDistribution({
          labels: demoItems.map((item) => item[0]),
          datasets: [
            {
              data: demoItems.map((item) => item[1]),
              backgroundColor: demoItems.map(
                (_, i) => `hsla(${(i * 360) / demoItems.length}, 70%, 50%, 0.7)`
              ),
              borderColor: demoItems.map(
                (_, i) => `hsl(${(i * 360) / demoItems.length}, 70%, 40%)`
              ),
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error(`Error fetching ${timeframe} sales data:`, error);

      // On error, use demo data
      const demoItems = [
        ["Product A", 145],
        ["Product B", 132],
        ["Product C", 121],
        ["Product D", 87],
        ["Product E", 65],
      ];

      setTopSellingItems(demoItems);
      setSalesDistribution({
        labels: demoItems.map((item) => item[0]),
        datasets: [
          {
            data: demoItems.map((item) => item[1]),
            backgroundColor: demoItems.map(
              (_, i) => `hsla(${(i * 360) / demoItems.length}, 70%, 50%, 0.7)`
            ),
            borderColor: demoItems.map(
              (_, i) => `hsl(${(i * 360) / demoItems.length}, 70%, 40%)`
            ),
            borderWidth: 1,
          },
        ],
      });
    }
  };

  // Function to fetch stock data
  const fetchStockData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stocks");
      console.log("Stock API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        const stockData = response.data.data;

        if (stockData.length === 0) {
          console.log("No stock data available");
          setStockDistribution(null);
        } else {
          const labels = stockData
            .slice(0, 8)
            .map((item) => item.product_name || item.name || "Unknown");
          const values = stockData.slice(0, 8).map((item) => {
            const qty =
              item.quantity ||
              item.stock_quantity ||
              item.product_quantity ||
              0;
            return Number(qty) || 0;
          });
          console.log("Stock Chart Labels:", labels);
          console.log("Stock Chart Values:", values);

          const hasValidData = values.some((val) => val > 0);
          if (!hasValidData) {
            console.log("No valid quantities found");
            setStockDistribution(null);
          } else {
            setStockDistribution({
              labels,
              datasets: [
                {
                  data: values,
                  backgroundColor: labels.map(
                    (_, i) =>
                      `hsla(${(i * 360) / labels.length}, 70%, 50%, 0.7)`
                  ),
                  borderColor: labels.map(
                    (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 40%)`
                  ),
                  borderWidth: 1,
                },
              ],
            });
          }
        }
      } else {
        console.log("Invalid stock API response:", response.data);
        setStockDistribution(null);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setStockDistribution(null);
    }
  };

  // Fetch chart data based on timeframe
  useEffect(() => {
    setIsLoading(true);

    const loadData = async () => {
      await fetchSalesDataForCharts();
      await fetchStockData();
      setIsLoading(false);
    };

    loadData();
  }, [timeframe]);

  // Format currency in LKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Toggle function for top selling items details
  const toggleItemDetails = () => {
    setShowItemDetails(!showItemDetails);
  };

  return (
    <div className="home-container-gm">
      <HeadBar />
      <GMNav />

      {/* Main Content */}
      <div className="main-content-gm">
        <div className="dashboard-header">
          <h2 className="dash-title-gm">General Manager Dashboard</h2>
          <div className="timeframe-selector">
            <button
              className={`timeframe-btn ${
                timeframe === "week" ? "active" : ""
              }`}
              onClick={() => setTimeframe("week")}
            >
              Week
            </button>
            <button
              className={`timeframe-btn ${
                timeframe === "month" ? "active" : ""
              }`}
              onClick={() => setTimeframe("month")}
            >
              Month
            </button>
            <button
              className={`timeframe-btn ${
                timeframe === "year" ? "active" : ""
              }`}
              onClick={() => setTimeframe("year")}
            >
              Year
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-graph-up"></i>
            </div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p>{formatCurrency(summaryStats.totalRevenue)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-cash"></i>
            </div>
            <div className="stat-info">
              <h3>Monthly Sales</h3>
              <p>{formatCurrency(summaryStats.monthlySales)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-arrow-up-right"></i>
            </div>
            <div className="stat-info">
              <h3>Yearly Growth</h3>
              <p>{summaryStats.yearlyGrowth}%</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-percent"></i>
            </div>
            <div className="stat-info">
              <h3>Operating Margin</h3>
              <p>{summaryStats.operatingMargin}%</p>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        )}

        {/* Dashboard Buttons */}
        <div className="dashboard-buttons-gm">
          <Link to="/viewstock-gm" className="dashboard-link-gm">
            <div className="dashboard-btn-gm">
              <div className="dash-btn-icon-gm">
                <i className="bi bi-box-seam-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-gm">Stocks</label>
                <span className="btn-description">Inventory management</span>
              </div>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/viewbuyers-gm" className="dashboard-link-gm">
            <div className="dashboard-btn-gm">
              <div className="dash-btn-icon-gm">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-gm">Buyers</label>
                <span className="btn-description">Customer database</span>
              </div>
              <span className="count-badge">{buyerCount}</span>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/GMviewsales" className="dashboard-link-gm">
            <div className="dashboard-btn-gm">
              <div className="dash-btn-icon-gm">
                <i className="bi bi-cash-stack"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-gm">Sales</label>
                <span className="btn-description">Revenue analytics</span>
              </div>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/GMviewproducts" className="dashboard-link-gm">
            <div className="dashboard-btn-gm">
              <div className="dash-btn-icon-gm">
                <i className="bi bi-inboxes-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-gm">Products</label>
                <span className="btn-description">Product catalog</span>
              </div>
              <span className="count-badge-s">{productCount}</span>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/GMviewemployee" className="dashboard-link-gm">
            <div className="dashboard-btn-gm">
              <div className="dash-btn-icon-gm">
                <i className="bi bi-person-vcard-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-gm">Employees</label>
                <span className="btn-description">Staff management</span>
              </div>
              <span className="count-badge-r">{employeeCount}</span>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/viewsuppliers" className="dashboard-link-gm">
            <div className="dashboard-btn-gm">
              <div className="dash-btn-icon-gm">
                <i className="bi bi-person-lines-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-gm">Suppliers</label>
                <span className="btn-description">Vendor relationships</span>
              </div>
              <span className="count-badge">{supplierCount}</span>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Charts Container */}
        {!isLoading && (
          <div className="dashboard-grid">
            {/* Sales Distribution Chart */}
            <div className="chart-card compact">
              <div className="chart-header">
                <h3>Sales Distribution</h3>
                <div className="chart-actions">
                  <button
                    className="refresh-btn"
                    onClick={() => fetchSalesDataForCharts()}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>
              <div className="chart-description">
                Daily sales breakdown for the selected {timeframe}
              </div>
              {chartData ? (
                <div className="chart-container">
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.raw.toFixed(1)}%`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: "%",
                          },
                        },
                        x: {
                          ticks: {
                            font: {
                              size: 10,
                            },
                          },
                        },
                      },
                      animation: {
                        duration: 800,
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="no-data-message">
                  <p>No sales data available</p>
                </div>
              )}
            </div>

            {/* Stock Distribution Chart */}
            <div className="chart-card compact">
              <div className="chart-header">
                <h3>Inventory Levels</h3>
                <div className="chart-actions">
                  <button
                    className="refresh-btn"
                    onClick={() => fetchStockData()}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>
              <div className="chart-description">
                Current stock quantities by product
              </div>
              {stockDistribution ? (
                <div className="chart-container">
                  <Doughnut
                    data={stockDistribution}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            boxWidth: 12,
                            font: {
                              size: 10,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.raw} units`,
                          },
                        },
                      },
                      animation: {
                        duration: 800,
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="no-data-message">
                  <p>No inventory data available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GMDashboard;
