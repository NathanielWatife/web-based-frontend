import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/CheckoutForm.css';
import { toast } from 'react-hot-toast';

const CheckoutForm = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    deliveryOption: 'pickup',
    deliveryAddress: '',
    paymentMethod: 'paystack',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          book: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal(),
        deliveryOption: formData.deliveryOption,
        deliveryAddress: formData.deliveryOption === 'delivery' ? formData.deliveryAddress : undefined,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod
      };

      // Create order first
      const orderResponse = await orderService.createOrder(orderData);
      const orderId = orderResponse.data._id;
      
      // Initialize payment with backend
      const paymentResponse = await paymentService.initializePayment({
        orderId: orderId,
        paymentMethod: formData.paymentMethod
      });

      if (paymentResponse.data && paymentResponse.data.authorizationUrl) {
        // Clear cart before redirecting to payment gateway
        clearCart();
        
        // Store order ID in sessionStorage for verification after redirect
        sessionStorage.setItem('paymentOrderId', orderId);
        
        // Redirect to payment gateway
        window.location.href = paymentResponse.data.authorizationUrl;
      } else {
        throw new Error('Payment initialization failed');
      }
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to process payment';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2>Checkout</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Delivery Options */}
            <div className="form-section">
              <h3>Delivery Method</h3>
              <div className="delivery-options">
                <label className="delivery-option">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="pickup"
                    checked={formData.deliveryOption === 'pickup'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <h4>Campus Pickup</h4>
                    <p>Pick up your order from the college library</p>
                    <span className="option-price">Free</span>
                  </div>
                </label>
                
                <label className="delivery-option">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="delivery"
                    checked={formData.deliveryOption === 'delivery'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <h4>Home Delivery</h4>
                    <p>Get your order delivered to your address</p>
                    <span className="option-price">₦500</span>
                  </div>
                </label>
              </div>

              {formData.deliveryOption === 'delivery' && (
                <div className="form-group">
                  <label className="form-label">Delivery Address</label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                    placeholder="Enter your complete delivery address"
                    required
                  />
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={formData.paymentMethod === 'paystack'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <h4>Paystack</h4>
                    <p>Pay with card, bank transfer, or USSD</p>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="flutterwave"
                    checked={formData.paymentMethod === 'flutterwave'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <h4>Flutterwave</h4>
                    <p>Pay with card, mobile money, or bank transfer</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label className="form-label">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  placeholder="Any special instructions or notes for your order..."
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={isProcessing}
            >
              {isProcessing ? <LoadingSpinner size="small" /> : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="order-summary-section">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item._id} className="order-item">
                  <div className="item-info">
                    <h5>{item.title}</h5>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{formData.deliveryOption === 'pickup' ? 'Free' : '₦500'}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>
                  {formatCurrency(
                    formData.deliveryOption === 'pickup' ? 
                    getCartTotal() : getCartTotal() + 500
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;