import React from 'react';
import { useCart } from '../../../contexts/CartContext';
import './CartSummary.css';

const CartSummary = ({ onCheckout }) => {
  const { cartItems, getCartTotal, getCartItemsCount } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const subtotal = getCartTotal();
  const shippingFee = subtotal > 0 ? 500 : 0; // Flat rate shipping
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + shippingFee + tax;

  const isCheckoutDisabled = cartItems.some(item => 
    item.quantity > item.book.stock_quantity
  );

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      
      <div className="summary-details">
        <div className="summary-row">
          <span>Items ({getCartItemsCount()}):</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="summary-row">
          <span>Shipping:</span>
          <span>{shippingFee > 0 ? formatPrice(shippingFee) : 'Free'}</span>
        </div>
        
        <div className="summary-row">
          <span>Tax (VAT):</span>
          <span>{formatPrice(tax)}</span>
        </div>
        
        <div className="summary-divider"></div>
        
        <div className="summary-row total">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {isCheckoutDisabled && (
        <div className="checkout-warning">
          <p>Some items in your cart exceed available stock. Please update quantities before checkout.</p>
        </div>
      )}

      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled || cartItems.length === 0}
        className="btn btn-primary btn-large checkout-btn"
      >
        Proceed to Checkout
      </button>

      <div className="security-notice">
        <div className="security-icon">🔒</div>
        <p>Your payment information is secure and encrypted</p>
      </div>
    </div>
  );
};

export default CartSummary;