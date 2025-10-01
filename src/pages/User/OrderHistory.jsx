import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../services/api/ordersAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual ordersAPI.getOrders()
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockOrders = () => {
    return [
      {
        id: 'ORD-001',
        order_date: '2024-01-15T10:30:00Z',
        status: 'delivered',
        total_amount: 12500,
        items: [
          { book: { title: 'Introduction to Computer Science', author: 'John Smith', cover_image: '' }, quantity: 1, price: 7500 },
          { book: { title: 'Data Structures and Algorithms', author: 'Jane Doe', cover_image: '' }, quantity: 1, price: 5000 }
        ],
        shipping_address: {
          first_name: 'John',
          last_name: 'Doe',
          address: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos',
          postal_code: '100001'
        }
      },
      {
        id: 'ORD-002',
        order_date: '2024-01-10T14:20:00Z',
        status: 'shipped',
        total_amount: 8900,
        items: [
          { book: { title: 'Calculus for Engineers', author: 'Dr. James Wilson', cover_image: '' }, quantity: 1, price: 8900 }
        ],
        shipping_address: {
          first_name: 'John',
          last_name: 'Doe',
          address: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos',
          postal_code: '100001'
        }
      },
      {
        id: 'ORD-003',
        order_date: '2024-01-05T09:15:00Z',
        status: 'processing',
        total_amount: 15200,
        items: [
          { book: { title: 'Organic Chemistry', author: 'Prof. Sarah Chen', cover_image: '' }, quantity: 1, price: 8200 },
          { book: { title: 'Physics for Scientists', author: 'Dr. Michael Brown', cover_image: '' }, quantity: 1, price: 7000 }
        ],
        shipping_address: {
          first_name: 'John',
          last_name: 'Doe',
          address: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos',
          postal_code: '100001'
        }
      },
      {
        id: 'ORD-004',
        order_date: '2023-12-20T16:45:00Z',
        status: 'cancelled',
        total_amount: 6300,
        items: [
          { book: { title: 'Business Mathematics', author: 'David Johnson', cover_image: '' }, quantity: 1, price: 6300 }
        ],
        shipping_address: {
          first_name: 'John',
          last_name: 'Doe',
          address: '123 Main Street',
          city: 'Lagos',
          state: 'Lagos',
          postal_code: '100001'
        }
      }
    ];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { label: 'Processing', class: 'processing' },
      shipped: { label: 'Shipped', class: 'shipped' },
      delivered: { label: 'Delivered', class: 'delivered' },
      cancelled: { label: 'Cancelled', class: 'cancelled' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           item.book.title.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesFilter && matchesSearch;
  });

  const getOrderStats = () => {
    const total = orders.length;
    const delivered = orders.filter(order => order.status === 'delivered').length;
    const processing = orders.filter(order => order.status === 'processing').length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);

    return { total, delivered, processing, totalSpent };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="container">
          <LoadingSpinner text="Loading your orders..." />
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="container">
        <div className="order-history-header">
          <h1>Order History</h1>
          <p>View and manage your past orders</p>
        </div>

        {/* Order Statistics */}
        <div className="order-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.delivered}</h3>
              <p>Delivered</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>{stats.processing}</h3>
              <p>Processing</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{formatPrice(stats.totalSpent)}</h3>
              <p>Total Spent</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="order-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search orders by ID or book title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders
            </button>
            <button
              className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
              onClick={() => setFilter('processing')}
            >
              Processing
            </button>
            <button
              className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
              onClick={() => setFilter('shipped')}
            >
              Shipped
            </button>
            <button
              className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilter('delivered')}
            >
              Delivered
            </button>
            <button
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Orders List */}
        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : "You haven't placed any orders yet"
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <Link to="/books" className="btn btn-primary">
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-meta">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">Placed on {formatDate(order.order_date)}</p>
                  </div>
                  <div className="order-status">
                    {getStatusBadge(order.status)}
                    <p className="order-total">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        {item.book.cover_image ? (
                          <img src={item.book.cover_image} alt={item.book.title} />
                        ) : (
                          <div className="image-placeholder">📚</div>
                        )}
                      </div>
                      <div className="item-details">
                        <h4>{item.book.title}</h4>
                        <p className="item-author">by {item.book.author}</p>
                        <p className="item-quantity">Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="shipping-info">
                    <strong>Shipping to:</strong>
                    <span>
                      {order.shipping_address.first_name} {order.shipping_address.last_name}, 
                      {order.shipping_address.address}, {order.shipping_address.city}
                    </span>
                  </div>
                  <div className="order-actions">
                    <button className="btn btn-outline btn-small">
                      View Details
                    </button>
                    {order.status === 'processing' && (
                      <button className="btn btn-outline btn-small">
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="btn btn-outline btn-small">
                        Download Invoice
                      </button>
                    )}
                    <button className="btn btn-primary btn-small">
                      Order Again
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;