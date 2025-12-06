import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import OrderSummary from '../components/orders/OrderSummary';
import OrderTracking from '../components/orders/OrderTracking';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const prevStatus = useRef(null);

  const verifyPayment = async (reference) => {
    try {
      const response = await paymentService.verifyPayment(reference);
      if (response.data && response.data.order) {
        setOrder(response.data.order);
        toast.success('Payment verified successfully!');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      // Continue loading order normally even if verification fails
    }
  };

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

  useEffect(() => {
    if (isAuthenticated && id) {
      loadOrder();
      
      // Check if returning from payment gateway
      const params = new URLSearchParams(window.location.search);
      const reference = params.get('reference');
      
      if (reference) {
        verifyPayment(reference);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, id]);

  // Lightweight polling to detect status changes and trigger toasts
  useEffect(() => {
    if (!isAuthenticated || !id) return;
    const interval = setInterval(async () => {
      try {
        const response = await orderService.getOrder(id);
        setOrder((prev) => {
          // Only update if something actually changed
          if (!prev || JSON.stringify(prev) !== JSON.stringify(response.data)) {
            return response.data;
          }
          return prev;
        });
      } catch (e) {
        // silent on polling errors
      }
    }, 10000); // Poll every 10 seconds for faster updates
    return () => clearInterval(interval);
  }, [isAuthenticated, id]);

  useEffect(() => {
    if (location.state && location.state.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
  }, [location.state]);

  useEffect(() => {
    if (order && order.status) {
      if (prevStatus.current && prevStatus.current !== order.status) {
        const formatted = String(order.status)
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        toast.success(`Order status updated to ${formatted}`);
      }
      prevStatus.current = order.status;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

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