import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';

const BookCard = ({ book }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
  };

  const getStockStatus = () => {
    if (book.stock_quantity === 0) {
      return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    } else if (book.stock_quantity <= 5) {
      return { text: 'Low Stock', color: 'text-orange-600 bg-orange-100' };
    } else {
      return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/books/${book.id}`} className="block">
        {/* Book Image */}
        <div className="aspect-w-3 aspect-h-4 bg-gray-200">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-16 bg-blue-300 mx-auto mb-2 rounded"></div>
                <span className="text-blue-600 text-sm font-medium">No Image</span>
              </div>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
          
          {book.course_code && (
            <p className="text-gray-500 text-xs mb-2">
              Course: {book.course_code}
            </p>
          )}
          
          {book.department && (
            <p className="text-gray-500 text-xs mb-3">
              Department: {book.department}
            </p>
          )}

          {/* Stock Status */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
            {book.stock_quantity > 0 && (
              <span className="text-xs text-gray-500">
                {book.stock_quantity} available
              </span>
            )}
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(book.price)}
            </span>
            
            {isAuthenticated && book.stock_quantity > 0 && (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            )}
            
            {!isAuthenticated && book.stock_quantity > 0 && (
              <Link
                to="/login"
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Login to Buy
              </Link>
            )}
            
            {book.stock_quantity === 0 && (
              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;