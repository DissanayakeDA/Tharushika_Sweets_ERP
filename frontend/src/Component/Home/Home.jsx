import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "./Home.css";
import { Link } from "react-router-dom";
import HeadBar from "../HeadBar/HeadBar";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components for Bar, Line, and Doughnut charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  // State management
  const [chartData, setChartData] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [lineChartData, setLineChartData] = useState(null);
  const [buyerCount, setBuyerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [todaySalesCount, setTodaySalesCount] = useState(0);
  const [todayReturnsCount, setTodayReturnsCount] = useState(0);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [timeframe, setTimeframe] = useState("week"); // week, month, year
  const [isLoading, setIsLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    returnRate: 0,
  });
  const [salesDistribution, setSalesDistribution] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [stockDistribution, setStockDistribution] = useState(null);

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

  const refreshData = () => {
    fetchChartData();
    fetchSalesData();
    fetchTodaySalesCount();
    fetchTodayReturnsCount();
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

  // Function to generate a color using HSL based on an index
  const generateColor = (index, total) => {
    const hue = (index / (total || 1)) * 360;
    return {
      border: `hsl(${hue}, 70%, 50%)`,
      background: `hsla(${hue}, 70%, 50%, 0.2)`,
    };
  };

  // Fetch data based on timeframe
  useEffect(() => {
    setIsLoading(true);
    fetchChartData();
    fetchSalesData();
  }, [timeframe]);

  // Fetch stock items
  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stocks");
        console.log("API Response:", response.data); // Debug the full response

        if (response.data.success && Array.isArray(response.data.data)) {
          const stockData = response.data.data;
          console.log("Stock Data:", stockData); // Debug the stock data

          // Extract product names for stockItems
          const items = stockData.map((item) => item.product_name);
          setStockItems(items);

          // Process data for the inventory chart
          if (stockData.length === 0) {
            setStockDistribution(null); // No data available
          } else {
            const labels = stockData
              .slice(0, 8)
              .map((item) => item.product_name);
            const values = stockData
              .slice(0, 8)
              .map((item) => Number(item.quantity || 0));

            // Check if all quantities are zero
            const totalQuantity = values.reduce((sum, val) => sum + val, 0);
            if (totalQuantity === 0) {
              setStockDistribution(null); // All quantities are zero
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
          console.error("API response missing success or data:", response.data);
          setStockDistribution(null);
        }
      } catch (error) {
        console.error("Error fetching stock items:", error);
        setStockDistribution(null);
      }
    };

    fetchStockItems();
    fetchBuyerCount();
    fetchProductCount();
    fetchTodaySalesCount();
    fetchTodayReturnsCount();
  }, []);

  const fetchStockItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stocks");
      console.log("API Response:", response.data); // Log the full response

      if (response.data.success && Array.isArray(response.data.data)) {
        const stockData = response.data.data;
        console.log("Stock Data:", stockData); // Log the stock data
        if (stockData.length > 0) {
          console.log("First Item:", stockData[0]); // Log the first item to check properties
        }

        // Extract product names (adjust property name if needed)
        const items = stockData.map(
          (item) => item.product_name || item.name || "Unknown"
        );
        setStockItems(items);

        // Process data for the inventory chart
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
            return Number(qty) || 0; // Ensure it's a number, default to 0 if invalid
          });
          console.log("Chart Labels:", labels); // Log labels
          console.log("Chart Values:", values); // Log values

          // Only set to null if there are no valid quantities (all are NaN or undefined)
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
        console.log("Invalid API response:", response.data);
        setStockDistribution(null);
      }
    } catch (error) {
      console.error("Error fetching stock items:", error);
      setStockDistribution(null);
    }
  };

  // Fetch stock items on component mount
  useEffect(() => {
    fetchStockItems();
    fetchBuyerCount();
    fetchProductCount();
    fetchTodaySalesCount();
    fetchTodayReturnsCount();
  }, []);

  // Fetch chart data based on timeframe
  const fetchChartData = async () => {
    try {
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

      const response = await axios.get(
        `http://localhost:5000/api/sales?startDate=${startDate}&endDate=${endDate}`
      );

      if (response.data.success) {
        const sales = response.data.sales;

        // Process data for the bar chart
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

        // Process data for top selling items
        const itemSalesMap = {};
        sales.forEach((sale) => {
          if (Array.isArray(sale.items)) {
            sale.items.forEach((item) => {
              if (!itemSalesMap[item.itemName]) {
                itemSalesMap[item.itemName] = 0;
              }
              itemSalesMap[item.itemName] += item.quantity;
            });
          }
        });

        const sortedItems = Object.entries(itemSalesMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        setTopSellingItems(sortedItems);

        // Create sales distribution data
        const pieLabels = sortedItems.map((item) => item[0]);
        const pieData = sortedItems.map((item) => item[1]);

        setSalesDistribution({
          labels: pieLabels,
          datasets: [
            {
              data: pieData,
              backgroundColor: pieLabels.map(
                (_, i) => `hsla(${(i * 360) / pieLabels.length}, 70%, 50%, 0.7)`
              ),
              borderColor: pieLabels.map(
                (_, i) => `hsl(${(i * 360) / pieLabels.length}, 70%, 40%)`
              ),
              borderWidth: 1,
            },
          ],
        });

        // Calculate summary statistics
        const totalQtySold = sales.reduce((sum, sale) => {
          if (Array.isArray(sale.items)) {
            return (
              sum +
              sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
            );
          }
          return sum;
        }, 0);

        const totalRevenue = sales.reduce(
          (sum, sale) => sum + sale.totalAmount,
          0
        );
        const averageOrderValue =
          sales.length > 0 ? totalRevenue / sales.length : 0;

        setSummaryStats({
          totalSales: sales.length,
          totalRevenue,
          averageOrderValue,
          returnRate: (todayReturnsCount / (todaySalesCount || 1)) * 100,
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching ${timeframe} chart data:`, error);
      setIsLoading(false);
    }
  };

  // Fetch sales data for the line chart
  const fetchSalesData = async () => {
    if (stockItems.length === 0) {
      setLineChartData(null);
      return;
    }

    try {
      const { startDate, endDate } = getDateRange();
      let url = `http://localhost:5000/api/sales?startDate=${startDate}&endDate=${endDate}`;

      if (selectedItem) {
        url += `&itemName=${selectedItem}`;
      }

      const response = await axios.get(url);

      if (response.data.success) {
        const sales = response.data.sales;
        const dateRange = getDatesInRange(startDate, endDate);

        if (selectedItem) {
          const dailySales = {};
          dateRange.forEach((date) => {
            dailySales[date] = 0;
          });

          sales.forEach((sale) => {
            const saleDate = new Date(sale.date).toISOString().split("T")[0];
            if (Array.isArray(sale.items)) {
              const item = sale.items.find(
                (item) => item.itemName === selectedItem
              );
              if (item) {
                dailySales[saleDate] += item.quantity;
              }
            }
          });

          setLineChartData({
            labels: dateRange.map((date) =>
              new Date(date).toLocaleDateString(
                "en-US",
                timeframe === "year"
                  ? { month: "short" }
                  : { month: "short", day: "numeric" }
              )
            ),
            datasets: [
              {
                label: `Sales Quantity for ${selectedItem}`,
                data: dateRange.map((date) => dailySales[date]),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.4,
              },
            ],
          });
        } else {
          const itemSales = {};
          stockItems.slice(0, 5).forEach((item) => {
            itemSales[item] = {};
            dateRange.forEach((date) => {
              itemSales[item][date] = 0;
            });
          });

          sales.forEach((sale) => {
            const saleDate = new Date(sale.date).toISOString().split("T")[0];
            if (Array.isArray(sale.items)) {
              sale.items.forEach((item) => {
                if (stockItems.slice(0, 5).includes(item.itemName)) {
                  itemSales[item.itemName][saleDate] =
                    (itemSales[item.itemName][saleDate] || 0) + item.quantity;
                }
              });
            }
          });

          const datasets = stockItems.slice(0, 5).map((item, index) => {
            const color = generateColor(index, stockItems.slice(0, 5).length);
            return {
              label: item,
              data: dateRange.map((date) => itemSales[item][date] || 0),
              borderColor: color.border,
              backgroundColor: color.background,
              fill: false,
              tension: 0.4,
            };
          });

          setLineChartData({
            labels: dateRange.map((date) =>
              new Date(date).toLocaleDateString(
                "en-US",
                timeframe === "year"
                  ? { month: "short" }
                  : { month: "short", day: "numeric" }
              )
            ),
            datasets: datasets,
          });
        }
      } else {
        setLineChartData(null);
      }
    } catch (error) {
      console.error("Error fetching sales for line chart:", error);
      setLineChartData(null);
    }
  };

  // Other fetching functions
  const fetchBuyerCount = async () => {
    try {
      const response = await axios.get("http://localhost:5000/buyers");
      if (response.data.buyers) {
        setBuyerCount(response.data.buyers.length);
      } else {
        setBuyerCount(0);
      }
    } catch (error) {
      console.error("Error fetching buyer count:", error);
      setBuyerCount(0);
    }
  };

  const fetchProductCount = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      if (response.data.success && response.data.data) {
        setProductCount(response.data.data.length);
      } else {
        setProductCount(0);
      }
    } catch (error) {
      console.error("Error fetching Product count:", error);
      setProductCount(0);
    }
  };

  const fetchTodaySalesCount = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `http://localhost:5000/api/sales?startDate=${today}&endDate=${today}`
      );

      if (response.data.success) {
        const filteredSales = response.data.sales.filter((saleRecord) => {
          const saleDate = new Date(saleRecord.date)
            .toISOString()
            .split("T")[0];
          return saleDate === today;
        });
        setTodaySalesCount(filteredSales.length);
      } else {
        const allSalesResponse = await axios.get(
          "http://localhost:5000/api/sales"
        );
        if (allSalesResponse.data.success) {
          const todaySales = allSalesResponse.data.sales.filter(
            (saleRecord) => {
              const saleDate = new Date(saleRecord.date)
                .toISOString()
                .split("T")[0];
              return saleDate === today;
            }
          );
          setTodaySalesCount(todaySales.length);
        } else {
          setTodaySalesCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching today's sales count:", error);
      setTodaySalesCount(0);
    }
  };

  const fetchTodayReturnsCount = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `http://localhost:5000/api/returns?startDate=${today}&endDate=${today}`
      );

      if (response.data.success) {
        const filteredReturns = response.data.returns.filter((returnRecord) => {
          const returnDate = new Date(returnRecord.date)
            .toISOString()
            .split("T")[0];
          return returnDate === today;
        });
        setTodayReturnsCount(filteredReturns.length);
      } else {
        const allReturnsResponse = await axios.get(
          "http://localhost:5000/api/returns"
        );
        if (allReturnsResponse.data.success) {
          const todayReturns = allReturnsResponse.data.returns.filter(
            (returnRecord) => {
              const returnDate = new Date(returnRecord.date)
                .toISOString()
                .split("T")[0];
              return returnDate === today;
            }
          );
          setTodayReturnsCount(todayReturns.length);
        } else {
          setTodayReturnsCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching today's returns count:", error);
      setTodayReturnsCount(0);
    }
  };

  // Toggle function for item details card
  const toggleItemDetails = () => {
    setShowItemDetails(!showItemDetails);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("si-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="home-container-st">
      <HeadBar />
      <Nav />
      <div className="main-content-st">
        <div className="dashboard-header">
          <h2 className="dash-title-st">Stock Manager Dashboard</h2>
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
              <h3>Total Sales</h3>
              <p>{summaryStats.totalSales}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-arrow-return-left"></i>
            </div>
            <div className="stat-info">
              <h3>Return Rate</h3>
              <p>{summaryStats.returnRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="dashboard-buttons-st">
          <Link to="/viewstock" className="dashboard-link-st">
            <div className="dashboard-btn-st">
              <div className="dash-btn-icon-st">
                <i className="bi bi-box-seam-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-st">Stocks</label>
                <span className="btn-description">Manage your Stocks</span>
              </div>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/viewbuyers" className="dashboard-link-st">
            <div className="dashboard-btn-st">
              <div className="dash-btn-icon-st">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-st">Buyers</label>
                <span className="btn-description">View Buyer information</span>
              </div>
              <span className="count-badge">{buyerCount}</span>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/viewsales" className="dashboard-link-st">
            <div className="dashboard-btn-st">
              <div className="dash-btn-icon-st">
                <i className="bi bi-cash-stack"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-st">Sales</label>
                <span className="btn-description">View daily transactions</span>
              </div>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/viewrequests" className="dashboard-link-st">
            <div className="dashboard-btn-st">
              <div className="dash-btn-icon-st">
                <i className="bi bi-bell-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-st">Requests</label>
                <span className="btn-description">Manage pending requests</span>
              </div>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/viewReturns" className="dashboard-link-st">
            <div className="dashboard-btn-st">
              <div className="dash-btn-icon-st">
                <i className="bi bi-arrow-counterclockwise"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-st">Returns</label>
                <span className="btn-description">View product returns</span>
              </div>
              <span className="count-badge-r">{todayReturnsCount}</span>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
          <Link to="/products" className="dashboard-link-st">
            <div className="dashboard-btn-st">
              <div className="dash-btn-icon-st">
                <i className="bi bi-inboxes-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-st">Products</label>
                <span className="btn-description">Manage product catalog</span>
              </div>
              <span className="count-badge-r">{productCount}</span>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>

          <Link to="/mystock-change-requests" className="dashboard-link-st">
            <div className="dashboard-btn-st">
              <div className="dash-btn-icon-st">
                <i className="bi bi-inboxes-fill"></i>
              </div>
              <div className="btn-content">
                <label className="dash-btn-text-st">Change Requests</label>
                <span className="btn-description">Check Request status</span>
              </div>
              <div className="btn-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        )}

        {/* Charts Container */}
        {!isLoading && (
          <div className="dashboard-grid">
            {/* Sales Distribution Chart */}
            <div className="chart-card compact">
              <div className="chart-header">
                <h3>Sales Distribution</h3>
                <div className="chart-actions">
                  <button className="refresh-btn" onClick={fetchChartData}>
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
                  <button className="refresh-btn" onClick={fetchStockItems}>
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

export default Home;
