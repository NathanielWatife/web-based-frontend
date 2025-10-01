import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './AdminDashboard.css';
import BooksManagement from './BooksManagement';
import UsersManagement from './UsersManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockBooks, setLowStockBooks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalSales: 1250000,
        totalOrders: 156,
        totalUsers: 89,
        totalBooks: 234,
        monthlyRevenue: 450000,
        pendingOrders: 12,
        lowStockCount: 8
      });

      setRecentOrders([
        { id: 'ORD-001', customer: 'John Doe', date: '2024-01-15', amount: 12500, status: 'delivered' },
        { id: 'ORD-002', customer: 'Jane Smith', date: '2024-01-14', amount: 8900, status: 'shipped' },
        { id: 'ORD-003', customer: 'Mike Johnson', date: '2024-01-14', amount: 15200, status: 'processing' },
        { id: 'ORD-004', customer: 'Sarah Wilson', date: '2024-01-13', amount: 6300, status: 'processing' },
        { id: 'ORD-005', customer: 'David Brown', date: '2024-01-13', amount: 21000, status: 'delivered' }
      ]);

      setLowStockBooks([
        { id: 1, title: 'Advanced Calculus', stock: 3, threshold: 5 },
        { id: 2, title: 'Organic Chemistry', stock: 2, threshold: 5 },
        { id: 3, title: 'Data Structures', stock: 4, threshold: 5 },
        { id: 4, title: 'Business Mathematics', stock: 1, threshold: 5 }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { label: 'Processing', class: 'processing' },
      shipped: { label: 'Shipped', class: 'shipped' },
      delivered: { label: 'Delivered', class: 'delivered' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <LoadingSpinner text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  const adminTabs = [
    { id: 'overview', name: 'Overview', icon: '📊', component: 'overview' },
    { id: 'orders', name: 'Orders', icon: '📦', component: 'orders' },
    { id: 'books', name: 'Books', icon: '📚', component: 'books' },
    { id: 'users', name: 'Users', icon: '👥', component: 'users' },
    { id: 'reports', name: 'Reports', icon: '📈', component: 'reports' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-welcome">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.first_name}! Here's what's happening today.</p>
          </div>
          <div className="admin-actions">
            <button className="btn btn-primary">
              + Add New Book
            </button>
            <button className="btn btn-secondary">
              Generate Report
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          {adminTabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-text">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'books' && <BooksManagement />}
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            {/* Key Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon revenue">💰</div>
                <div className="metric-info">
                  <h3>{formatPrice(stats.totalSales)}</h3>
                  <p>Total Revenue</p>
                  <span className="metric-trend positive">+12% from last month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon orders">📦</div>
                <div className="metric-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                  <span className="metric-trend positive">+8% from last month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon users">👥</div>
                <div className="metric-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Registered Users</p>
                  <span className="metric-trend positive">+15 new this month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon books">📚</div>
                <div className="metric-info">
                  <h3>{stats.totalBooks}</h3>
                  <p>Books in Catalog</p>
                  <span className="metric-trend">8 low in stock</span>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              {/* Recent Orders */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Recent Orders</h3>
                  <Link to="/admin/orders" className="view-all">
                    View All →
                  </Link>
                </div>
                <div className="card-content">
                  <div className="orders-list">
                    {recentOrders.map(order => (
                      <div key={order.id} className="order-row">
                        <div className="order-info">
                          <strong>#{order.id}</strong>
                          <span>{order.customer}</span>
                        </div>
                        <div className="order-meta">
                          <span>{formatDate(order.date)}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="order-amount">
                          {formatPrice(order.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Low Stock Alert */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Low Stock Alert</h3>
                  <span className="alert-count">{stats.lowStockCount}</span>
                </div>
                <div className="card-content">
                  <div className="stock-list">
                    {lowStockBooks.map(book => (
                      <div key={book.id} className="stock-item">
                        <div className="book-info">
                          <h4>{book.title}</h4>
                          <span className={`stock-level ${
                            book.stock === 1 ? 'critical' : 
                            book.stock <= 3 ? 'low' : 'warning'
                          }`}>
                            {book.stock} left
                          </span>
                        </div>
                        <button className="btn btn-outline btn-small">
                          Restock
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="card-content">
                  <div className="quick-actions">
                    <button className="action-btn">
                      <span className="action-icon">➕</span>
                      <span>Add New Book</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">📊</span>
                      <span>View Reports</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">📦</span>
                      <span>Manage Orders</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">👥</span>
                      <span>User Management</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">⚙️</span>
                      <span>Settings</span>
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">📈</span>
                      <span>Analytics</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Recent Activity</h3>
                </div>
                <div className="card-content">
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">📦</div>
                      <div className="activity-content">
                        <p><strong>New order</strong> #ORD-006 placed</p>
                        <span>2 minutes ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">✅</div>
                      <div className="activity-content">
                        <p>Order <strong>#ORD-003</strong> shipped</p>
                        <span>1 hour ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">📚</div>
                      <div className="activity-content">
                        <p>Book <strong>Introduction to Python</strong> added</p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">👤</div>
                      <div className="activity-content">
                        <p>New user <strong>Sarah Johnson</strong> registered</p>
                        <span>3 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {!['overview', 'books'].includes(activeTab) && (
          <div className="dashboard-content">
            <div className="coming-soon">
              <div className="coming-soon-icon">🚧</div>
              <h2>Coming Soon</h2>
              <p>The {adminTabs.find(tab => tab.id === activeTab)?.name} section is under development.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab('overview')}
              >
                Back to Overview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;