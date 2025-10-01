import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get order data from navigation state
  const orderData = location.state?.orderData;
  const orderId = location.state?.orderId;

  // Redirect if no order data
  if (!orderData || !orderId) {
    navigate('/');
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const getEstimatedDelivery = () => {
    const shippingMethod = orderData.shipping.shipping_method;
    const today = new Date();
    
    if (shippingMethod === 'express') {
      today.setDate(today.getDate() + 2);
      return today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else {
      today.setDate(today.getDate() + 5);
      return today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const subtotal = orderData.total;
  const shippingFee = orderData.shipping?.shipping_method === 'express' ? 1500 : 500;
  const tax = subtotal * 0.075;
  const total = subtotal + shippingFee + tax;

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          {/* Success Header */}
          <div className="confirmation-header">
            <div className="success-icon">🎉</div>
            <h1>Order Confirmed!</h1>
            <p className="confirmation-subtitle">
              Thank you for your purchase, <strong>{user?.first_name}</strong>!
            </p>
            <div className="order-number">
              Order #: <strong>{orderId}</strong>
            </div>
          </div>

          {/* Order Summary */}
          <div className="confirmation-section">
            <h2>Order Summary</h2>
            <div className="order-items-confirmation">
              {orderData.items.map((item, index) => (
                <div key={index} className="confirmation-item">
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
                    <p className="item-meta">Quantity: {item.quantity} × {formatPrice(item.book.price)}</p>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.book.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals-confirmation">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <div className="total-row">
                <span>Tax (VAT):</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="total-divider"></div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="confirmation-section">
            <h2>Delivery Information</h2>
            <div className="delivery-info">
              <div className="info-grid">
                <div className="info-item">
                  <strong>Estimated Delivery:</strong>
                  <span>{getEstimatedDelivery()}</span>
                </div>
                <div className="info-item">
                  <strong>Shipping Method:</strong>
                  <span>
                    {orderData.shipping.shipping_method === 'express' ? 'Express' : 'Standard'} 
                    ({orderData.shipping.shipping_method === 'express' ? '1-2 days' : '3-5 days'})
                  </span>
                </div>
                <div className="info-item">
                  <strong>Delivery Address:</strong>
                  <span>
                    {orderData.shipping.address}, {orderData.shipping.city},<br />
                    {orderData.shipping.state} {orderData.shipping.postal_code},<br />
                    {orderData.shipping.country}
                  </span>
                </div>
                <div className="info-item">
                  <strong>Recipient:</strong>
                  <span>
                    {orderData.shipping.first_name} {orderData.shipping.last_name}<br />
                    {orderData.shipping.phone}<br />
                    {orderData.shipping.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="confirmation-section">
            <h2>Payment Information</h2>
            <div className="payment-info">
              <div className="info-grid">
                <div className="info-item">
                  <strong>Payment Method:</strong>
                  <span>
                    {orderData.payment.payment_method === 'card' ? 'Credit/Debit Card' : 
                     orderData.payment.payment_method === 'paystack' ? 'Paystack' :
                     orderData.payment.payment_method === 'flutterwave' ? 'Flutterwave' : 
                     'Bank Transfer'}
                  </span>
                </div>
                {orderData.payment.payment_method === 'card' && (
                  <>
                    <div className="info-item">
                      <strong>Card Ending:</strong>
                      <span>•••• {orderData.payment.card_number.slice(-4)}</span>
                    </div>
                    <div className="info-item">
                      <strong>Card Holder:</strong>
                      <span>{orderData.payment.card_holder}</span>
                    </div>
                  </>
                )}
                <div className="info-item">
                  <strong>Payment Status:</strong>
                  <span className="status-paid">Paid</span>
                </div>
                <div className="info-item">
                  <strong>Order Status:</strong>
                  <span className="status-processing">Processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="confirmation-section next-steps">
            <h2>What's Next?</h2>
            <div className="steps-timeline">
              <div className="step">
                <div className="step-icon">📧</div>
                <div className="step-content">
                  <h4>Order Confirmation Email</h4>
                  <p>We've sent a confirmation email to {orderData.shipping.email} with your order details.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-icon">📦</div>
                <div className="step-content">
                  <h4>Order Processing</h4>
                  <p>We're preparing your order for shipment. You'll receive a notification when it ships.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-icon">🚚</div>
                <div className="step-content">
                  <h4>Delivery</h4>
                  <p>Your order will be delivered by {getEstimatedDelivery()}.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="confirmation-actions">
            <Link to="/orders" className="btn btn-primary btn-large">
              View Order Details
            </Link>
            <Link to="/books" className="btn btn-outline btn-large">
              Continue Shopping
            </Link>
            <button 
              onClick={() => window.print()} 
              className="btn btn-secondary btn-large"
            >
              Print Receipt
            </button>
          </div>

          {/* Support Information */}
          <div className="support-info">
            <h3>Need Help?</h3>
            <p>
              If you have any questions about your order, please contact our support team.
            </p>
            <div className="support-contacts">
              <div className="contact-item">
                <strong>Email:</strong> bookshop@yabatech.edu.ng
              </div>
              <div className="contact-item">
                <strong>Phone:</strong> +234 123 456 7890
              </div>
              <div className="contact-item">
                <strong>Hours:</strong> Mon-Fri, 8:00 AM - 5:00 PM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;