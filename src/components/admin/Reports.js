import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AdminDashboard.css';

const Reports = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await adminService.getDashboardStats();
        const data = response.data?.data || {};
        const s = data.stats || {};
        setStats({
          totalBooks: s.totalBooks || 0,
          totalOrders: s.totalOrders || 0,
          totalRevenue: s.totalRevenue || 0,
          pendingOrders: s.pendingOrders || 0,
        });
        setLowStockBooks(Array.isArray(data.lowStockBooks) ? data.lowStockBooks : []);
        setRecentOrders(Array.isArray(data.recentOrders) ? data.recentOrders : []);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <h1>Reports</h1>
        <p>Key operational metrics and summaries</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.totalBooks}</h3>
            <p>Total Active Books</p>
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
      </div>

      <div className="dashboard-section">
        <h2>Low Stock Books</h2>
        {lowStockBooks.length === 0 ? (
          <div className="empty-state"><p>No low stock alerts</p></div>
        ) : (
          <div className="orders-table">
            <div className="table-header">
              <div>Title</div>
              <div>Author</div>
              <div>Stock</div>
              <div>Category</div>
            </div>
            {lowStockBooks.map(book => (
              <div key={book._id} className="table-row">
                <div>{book.title}</div>
                <div>{book.author}</div>
                <div>{book.stockQuantity}</div>
                <div>{book.category}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="empty-state"><p>No recent orders</p></div>
        ) : (
          <div className="orders-table">
            <div className="table-header">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
            </div>
            {recentOrders.map(order => (
              <div key={order._id} className="table-row">
                <div className="order-id">#{order.orderId}</div>
                <div>{order.user?.firstName} {order.user?.lastName}</div>
                <div>{formatCurrency(order.totalAmount)}</div>
                <div>{order.status}</div>
                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
