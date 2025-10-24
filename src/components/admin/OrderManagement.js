import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AdminManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadOrders = useCallback(async () => {
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const response = await adminService.getAllOrders(params);
      const data = response.data?.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      loadOrders(); // Reload orders to get updated data
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="admin-management">
      <div className="management-header">
        <h2>Order Management</h2>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="ready-for-pickup">Ready for Pickup</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="management-table">
        <div className="table-header">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Items</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Date</div>
          <div>Actions</div>
        </div>

        {filteredOrders.map(order => (
          <div key={order._id} className="table-row">
            <div className="order-id">#{order.orderId}</div>
            <div className="customer-info">
              <strong>{order.user?.firstName} {order.user?.lastName}</strong>
              <small>{order.user?.matricNo}</small>
              <small>{order.user?.email}</small>
            </div>
            <div className="order-items">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="item-preview">
                  {item.book?.title} (x{item.quantity})
                </div>
              ))}
              {order.items.length > 2 && (
                <small>+{order.items.length - 2} more items</small>
              )}
            </div>
            <div className="amount">{formatCurrency(order.totalAmount)}</div>
            <div className="status">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                className="status-select"
                style={{ 
                  backgroundColor: ORDER_STATUS[order.status].color,
                  color: 'white'
                }}
              >
                {Object.entries(ORDER_STATUS).map(([key, status]) => (
                  <option key={key} value={key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="date">{formatDate(order.createdAt)}</div>
            <div className="actions">
              <button className="btn btn-outline">
                View Details
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;