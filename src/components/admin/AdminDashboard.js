import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    unverifiedPayments: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
    
    // Set up polling for real-time updates every 8 seconds
    const interval = setInterval(loadDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      const data = response.data?.data || {};
      const s = data.stats || {};
      const recent = Array.isArray(data.recentOrders) ? data.recentOrders : [];

      // Count orders with successful payment but pending status (unverified)
      const unverified = recent.filter(
        order => order.paymentStatus === 'successful' && order.status === 'pending'
      ).length;

      setStats({
        totalBooks: s.totalBooks || 0,
        totalOrders: s.totalOrders || 0,
        totalRevenue: s.totalRevenue || 0,
        pendingOrders: s.pendingOrders || 0,
        unverifiedPayments: unverified
      });

      setRecentOrders(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your bookstore operations</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.totalBooks}</h3>
            <p>Total Books</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        {stats.unverifiedPayments > 0 && (
          <div className="stat-card alert">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.unverifiedPayments}</h3>
              <p>Auto-Verified Payments</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <h2>Recent Orders</h2>
        <div className="recent-orders">
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <p>No recent orders</p>
            </div>
          ) : (
            <div className="orders-table">
              <div className="table-header">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Amount</div>
                <div>Payment</div>
                <div>Status</div>
                <div>Date</div>
              </div>
              {recentOrders.map(order => (
                <div key={order._id} className="table-row">
                  <div className="order-id">#{order.orderId}</div>
                  <div className="customer">
                    {order.user?.firstName} {order.user?.lastName}
                  </div>
                  <div className="amount">{formatCurrency(order.totalAmount)}</div>
                  <div className="payment-status">
                    <span 
                      className="status-badge payment"
                      style={{ 
                        backgroundColor: 
                          order.paymentStatus === 'successful' ? '#10b981' :
                          order.paymentStatus === 'failed' ? '#ef4444' : '#9ca3af'
                      }}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="status">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: 
                          order.status === 'completed' ? '#10b981' :
                          order.status === 'pending' ? '#f59e0b' :
                          order.status === 'cancelled' ? '#ef4444' : '#3b82f6'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => navigate('/admin/books')}>
            <span className="action-icon">➕</span>
            <span>Add New Book</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/admin/orders')}>
            <span className="action-icon">📦</span>
            <span>Manage Orders</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/admin/users')}>
            <span className="action-icon">👥</span>
            <span>View Users</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/admin/reports')}>
            <span className="action-icon">📊</span>
            <span>View Reports</span>
          </button>
          <button className="action-btn" onClick={() => navigate('/admin/tickets')}>
            <span className="action-icon">💬</span>
            <span>Support Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;