import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api/reportsAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './ReportsAnalytics.css';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [reportData, setReportData] = useState({});
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = generateMockReportData();
      setReportData(mockData);
      setChartData(generateMockChartData());
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockReportData = () => {
    return {
      overview: {
        totalRevenue: 1250000,
        totalOrders: 156,
        averageOrderValue: 8012,
        newCustomers: 23,
        conversionRate: 4.2
      },
      sales: {
        currentPeriod: 450000,
        previousPeriod: 380000,
        growth: 18.4
      },
      orders: {
        currentPeriod: 45,
        previousPeriod: 38,
        growth: 15.8
      },
      customers: {
        currentPeriod: 23,
        previousPeriod: 18,
        growth: 21.7
      },
      topProducts: [
        { id: 1, title: 'Introduction to Computer Science', sales: 45, revenue: 337500 },
        { id: 2, title: 'Advanced Calculus', sales: 32, revenue: 262400 },
        { id: 3, title: 'Data Structures and Algorithms', sales: 28, revenue: 196000 },
        { id: 4, title: 'Organic Chemistry', sales: 25, revenue: 205000 },
        { id: 5, title: 'Business Mathematics', sales: 22, revenue: 138600 }
      ],
      recentActivity: [
        { type: 'order', description: 'New order #ORD-167 placed', time: '2 minutes ago' },
        { type: 'order', description: 'Order #ORD-166 shipped', time: '1 hour ago' },
        { type: 'user', description: 'New user registration', time: '2 hours ago' },
        { type: 'stock', description: 'Low stock alert: Advanced Calculus', time: '3 hours ago' },
        { type: 'order', description: 'Order #ORD-165 delivered', time: '5 hours ago' }
      ]
    };
  };

  const generateMockChartData = () => {
    return {
      revenue: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
      orders: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
      customers: [8, 12, 10, 15, 18, 20, 22, 25, 23, 28, 26, 30]
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const getGrowthClass = (growth) => {
    return growth >= 0 ? 'positive' : 'negative';
  };

  const renderSimpleBarChart = (data, title, color) => {
    const maxValue = Math.max(...data);
    return (
      <div className="simple-chart">
        <h4>{title}</h4>
        <div className="chart-bars">
          {data.map((value, index) => (
            <div key={index} className="chart-bar-container">
              <div
                className="chart-bar"
                style={{
                  height: `${(value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
                title={`${title}: ${formatNumber(value)}`}
              ></div>
              <span className="chart-label">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="reports-analytics">
        <div className="container">
          <LoadingSpinner text="Loading analytics..." />
        </div>
      </div>
    );
  }

  return (
    <div className="reports-analytics">
      <div className="container">
        <div className="reports-header">
          <div className="header-content">
            <h1>Reports & Analytics</h1>
            <p>Track your business performance and key metrics</p>
          </div>
          <div className="date-range-selector">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="range-select"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="btn btn-secondary" onClick={fetchReportData}>
              Refresh Data
            </button>
            <button className="btn btn-primary">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card large">
            <div className="metric-header">
              <h3>Total Revenue</h3>
              <span className={`growth ${getGrowthClass(reportData.sales.growth)}`}>
                {reportData.sales.growth >= 0 ? '↑' : '↓'} {Math.abs(reportData.sales.growth)}%
              </span>
            </div>
            <div className="metric-value">
              {formatPrice(reportData.overview.totalRevenue)}
            </div>
            <div className="metric-comparison">
              vs {formatPrice(reportData.sales.previousPeriod)} previous period
            </div>
            {renderSimpleBarChart(chartData.revenue, 'Revenue', '#4ecdc4')}
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>Total Orders</h3>
              <span className={`growth ${getGrowthClass(reportData.orders.growth)}`}>
                {reportData.orders.growth >= 0 ? '↑' : '↓'} {Math.abs(reportData.orders.growth)}%
              </span>
            </div>
            <div className="metric-value">
              {formatNumber(reportData.overview.totalOrders)}
            </div>
            <div className="metric-comparison">
              vs {formatNumber(reportData.orders.previousPeriod)} previous period
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>Avg. Order Value</h3>
            </div>
            <div className="metric-value">
              {formatPrice(reportData.overview.averageOrderValue)}
            </div>
            <div className="metric-comparison">
              Per order average
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>New Customers</h3>
              <span className={`growth ${getGrowthClass(reportData.customers.growth)}`}>
                {reportData.customers.growth >= 0 ? '↑' : '↓'} {Math.abs(reportData.customers.growth)}%
              </span>
            </div>
            <div className="metric-value">
              {formatNumber(reportData.overview.newCustomers)}
            </div>
            <div className="metric-comparison">
              vs {formatNumber(reportData.customers.previousPeriod)} previous period
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>Conversion Rate</h3>
            </div>
            <div className="metric-value">
              {reportData.overview.conversionRate}%
            </div>
            <div className="metric-comparison">
              Visitor to customer rate
            </div>
          </div>
        </div>

        <div className="reports-grid">
          {/* Top Products */}
          <div className="report-card">
            <div className="card-header">
              <h3>Top Performing Products</h3>
              <span className="card-badge">{reportData.topProducts.length} products</span>
            </div>
            <div className="card-content">
              <div className="products-list">
                {reportData.topProducts.map((product, index) => (
                  <div key={product.id} className="product-item">
                    <div className="product-rank">
                      #{index + 1}
                    </div>
                    <div className="product-info">
                      <h4>{product.title}</h4>
                      <div className="product-stats">
                        <span className="sales">{product.sales} sales</span>
                        <span className="revenue">{formatPrice(product.revenue)}</span>
                      </div>
                    </div>
                    <div className="product-actions">
                      <button className="btn-action view" title="View Product">
                        👁️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="report-card">
            <div className="card-header">
              <h3>Performance Charts</h3>
            </div>
            <div className="card-content">
              <div className="charts-container">
                {renderSimpleBarChart(chartData.orders, 'Orders', '#45b7d1')}
                {renderSimpleBarChart(chartData.customers, 'New Customers', '#96ceb4')}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="report-card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="card-content">
              <div className="activity-list">
                {reportData.recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className={`activity-icon ${activity.type}`}>
                      {activity.type === 'order' && '📦'}
                      {activity.type === 'user' && '👤'}
                      {activity.type === 'stock' && '📊'}
                    </div>
                    <div className="activity-content">
                      <p>{activity.description}</p>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="report-card">
            <div className="card-header">
              <h3>Quick Stats</h3>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Pending Orders</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">8</div>
                  <div className="stat-label">Low Stock Items</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">92%</div>
                  <div className="stat-label">Order Accuracy</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">4.8/5</div>
                  <div className="stat-label">Customer Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Reports */}
        <div className="additional-reports">
          <h3>Additional Reports</h3>
          <div className="report-actions">
            <button className="report-action-btn">
              <span className="action-icon">📦</span>
              <span>Sales Report</span>
            </button>
            <button className="report-action-btn">
              <span className="action-icon">👥</span>
              <span>Customer Report</span>
            </button>
            <button className="report-action-btn">
              <span className="action-icon">📚</span>
              <span>Inventory Report</span>
            </button>
            <button className="report-action-btn">
              <span className="action-icon">💰</span>
              <span>Revenue Report</span>
            </button>
            <button className="report-action-btn">
              <span className="action-icon">🚚</span>
              <span>Shipping Report</span>
            </button>
            <button className="report-action-btn">
              <span className="action-icon">📊</span>
              <span>Custom Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;