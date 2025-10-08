import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

const CartSummary = ({ onCheckout }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const total = getCartTotal();
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const shippingFee = total > 0 ? 500 : 0; // Fixed shipping fee
  const grandTotal = total + shippingFee;

  const hasOutOfStockItems = cartItems.some(item => item.quantity > item.stock_quantity);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items ({itemsCount})</span>
          <span className="text-gray-900">{formatCurrency(total)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shippingFee > 0 ? formatCurrency(shippingFee) : 'Free'}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {hasOutOfStockItems && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            Some items in your cart exceed available stock. Please adjust quantities before proceeding.
          </p>
        </div>
      )}

      {cartItems.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            Your cart is empty. Add some books to continue.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {isAuthenticated ? (
          <>
            <button
              onClick={onCheckout}
              disabled={cartItems.length === 0 || hasOutOfStockItems}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Proceed to Checkout
            </button>
            
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Clear Cart
              </button>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center block"
          >
            Login to Checkout
          </Link>
        )}
        
        <Link
          to="/books"
          className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-center block"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Secure checkout
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-2">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Campus pickup available
        </div>
      </div>
    </div>
  );
};

export default CartSummary;