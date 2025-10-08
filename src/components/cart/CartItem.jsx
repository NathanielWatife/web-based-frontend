import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.stock_quantity) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex items-center hover:bg-gray-50 px-6 py-4 border-b border-gray-200">
      {/* Book Image */}
      <div className="flex-shrink-0 w-20 h-24 bg-gray-200 rounded-lg overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-6 h-8 bg-blue-300 mx-auto mb-1 rounded"></div>
              <span className="text-blue-600 text-xs">No Image</span>
            </div>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="ml-4 flex-1 min-w-0">
        <Link
          to={`/books/${item.id}`}
          className="text-lg font-medium text-gray-900 hover:text-blue-600 truncate block"
        >
          {item.title}
        </Link>
        <p className="text-sm text-gray-600 mt-1">by {item.author}</p>
        <p className="text-lg font-semibold text-blue-600 mt-2">
          {formatCurrency(item.price)}
        </p>
        
        {/* Stock Warning */}
        {item.quantity > item.stock_quantity && (
          <p className="text-sm text-red-600 mt-1">
            Only {item.stock_quantity} available in stock
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="w-12 h-8 flex items-center justify-center text-sm font-medium text-gray-900 border-l border-r border-gray-300">
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stock_quantity}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Subtotal */}
        <div className="w-24 text-right">
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(subtotal)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Remove from cart"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;