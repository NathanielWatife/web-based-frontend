import React from 'react';
import { useCart } from '../../../contexts/CartContext';
import './OrderReview.css';

const OrderReview = ({ orderData, cartItems, onEditShipping, onEditPayment, onSubmit, loading }) => {
  const { getCartTotal } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    const visible = cardNumber.slice(-4);
    return `•••• •••• •••• ${visible}`;
  };

  const getPaymentMethodDisplay = (paymentMethod) => {
    const methods = {
      card: 'Credit/Debit Card',
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      bank_transfer: 'Bank Transfer'
    };
    return methods[paymentMethod] || paymentMethod;
  };

  const subtotal = getCartTotal();
  const shippingFee = orderData.shipping?.shipping_method === 'express' ? 1500 : 500;
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + shippingFee + tax;

  return (
    <div className="order-review">
      <h2>Review Your Order</h2>
      <p>Please review your order details before proceeding</p>

      <div className="review-sections">
        {/* Shipping Information */}
        <div className="review-section">
          <div className="section-header">
            <h3>Shipping Information</h3>
            <button
              onClick={onEditShipping}
              className="btn-edit"
              type="button"
            >
              Edit
            </button>
          </div>
          <div className="section-content">
            <div className="info-grid">
              <div className="info-item">
                <strong>Name:</strong>
                <span>{orderData.shipping.first_name} {orderData.shipping.last_name}</span>
              </div>
              <div className="info-item">
                <strong>Email:</strong>
                <span>{orderData.shipping.email}</span>
              </div>
              <div className="info-item">
                <strong>Phone:</strong>
                <span>{orderData.shipping.phone}</span>
              </div>
              <div className="info-item">
                <strong>Address:</strong>
                <span>{orderData.shipping.address}</span>
              </div>
              <div className="info-item">
                <strong>City/State:</strong>
                <span>{orderData.shipping.city}, {orderData.shipping.state}</span>
              </div>
              <div className="info-item">
                <strong>Postal Code:</strong>
                <span>{orderData.shipping.postal_code}</span>
              </div>
              <div className="info-item">
                <strong>Country:</strong>
                <span>{orderData.shipping.country}</span>
              </div>
              <div className="info-item">
                <strong>Shipping Method:</strong>
                <span>
                  {orderData.shipping.shipping_method === 'express' ? 'Express' : 'Standard'} 
                  ({orderData.shipping.shipping_method === 'express' ? '1-2 days' : '3-5 days'})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="review-section">
          <div className="section-header">
            <h3>Payment Method</h3>
            <button
              onClick={onEditPayment}
              className="btn-edit"
              type="button"
            >
              Edit
            </button>
          </div>
          <div className="section-content">
            <div className="payment-display">
              <div className="payment-method">
                <strong>Method:</strong>
                <span>{getPaymentMethodDisplay(orderData.payment.payment_method)}</span>
              </div>
              
              {orderData.payment.payment_method === 'card' && (
                <>
                  <div className="payment-detail">
                    <strong>Card Number:</strong>
                    <span>{formatCardNumber(orderData.payment.card_number)}</span>
                  </div>
                  <div className="payment-detail">
                    <strong>Card Holder:</strong>
                    <span>{orderData.payment.card_holder}</span>
                  </div>
                  <div className="payment-detail">
                    <strong>Expires:</strong>
                    <span>{orderData.payment.expiry_date}</span>
                  </div>
                </>
              )}
              
              {orderData.payment.payment_method === 'bank_transfer' && (
                <div className="bank-transfer-note">
                  <p>You will complete payment via bank transfer using the provided account details.</p>
                </div>
              )}
              
              {(orderData.payment.payment_method === 'paystack' || orderData.payment.payment_method === 'flutterwave') && (
                <div className="gateway-note">
                  <p>You will be redirected to complete payment securely.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="review-section">
          <div className="section-header">
            <h3>Order Items</h3>
          </div>
          <div className="section-content">
            <div className="order-items-review">
              {cartItems.map(item => (
                <div key={item.id || item.book.id} className="order-item-review">
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
                    {formatPrice(item.book.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="review-section">
          <div className="section-header">
            <h3>Order Summary</h3>
          </div>
          <div className="section-content">
            <div className="order-summary-review">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (VAT 7.5%):</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="terms-agreement">
        <label className="checkbox-label">
          <input type="checkbox" required />
          <span>
            I agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and confirm that I have read the{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </span>
        </label>
      </div>

      {/* Final Actions */}
      <div className="review-actions">
        <button
          type="button"
          onClick={onEditShipping}
          className="btn btn-outline"
        >
          ← Back to Shipping
        </button>
        
        <div className="primary-actions">
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="btn btn-primary btn-large place-order-btn"
          >
            {loading ? (
              <>
                <div className="loading-spinner-small"></div>
                Processing Order...
              </>
            ) : (
              `Place Order - ${formatPrice(total)}`
            )}
          </button>
          
          <p className="order-note">
            By placing your order, you agree to our terms and conditions. 
            You'll receive an email confirmation shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;