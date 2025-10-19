import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import OrderSummary from '../components/orders/OrderSummary';
import OrderTracking from '../components/orders/OrderTracking';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && id) {
      loadOrder();
    }
  }, [isAuthenticated, id]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      setError('Failed to load order details');
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Order Details</h1>
          <p>Please log in to view order details</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Order Details</h1>
        </div>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Order Details</h1>
        </div>
        <div className="error-message">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Order #{order.orderId}</h1>
          <p>Order placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="container">
        <div className="order-details-layout">
          <div className="order-tracking-section">
            <OrderTracking order={order} />
          </div>
          <div className="order-summary-section">
            <OrderSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;