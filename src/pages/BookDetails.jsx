import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { booksAPI } from '../services/books';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const BookDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const { data: book, loading, error } = useApi(() => booksAPI.getBook(id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
          <Link to="/books" className="text-blue-600 hover:text-blue-800">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return <Navigate to="/books" replace />;
  }

  const handleAddToCart = () => {
    addToCart(book);
  };

  const getStockStatus = () => {
    if (book.stock_quantity === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (book.stock_quantity <= 5) {
      return { text: 'Low Stock', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    } else {
      return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link to="/books" className="ml-2 hover:text-blue-600">Books</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="ml-2 text-gray-900 font-medium">{book.title}</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Book Image */}
            <div className="flex justify-center">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full max-w-md h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full max-w-md h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-32 bg-blue-300 mx-auto mb-4 rounded shadow-inner"></div>
                    <span className="text-blue-600 text-lg font-medium">No Image Available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bgColor} ${stockStatus.color} mb-4`}>
                  {stockStatus.text}
                  {book.stock_quantity > 0 && (
                    <span className="ml-1">({book.stock_quantity} available)</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-blue-600">
                  {formatCurrency(book.price)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {isAuthenticated && book.stock_quantity > 0 && (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Add to Cart
                  </button>
                )}
                
                {!isAuthenticated && book.stock_quantity > 0 && (
                  <Link
                    to="/login"
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
                  >
                    Login to Purchase
                  </Link>
                )}
                
                {book.stock_quantity === 0 && (
                  <button
                    disabled
                    className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>

              {/* Additional Information */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                {book.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{book.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {book.category && (
                    <div>
                      <span className="font-semibold text-gray-900">Category:</span>
                      <span className="ml-2 text-gray-600">{book.category.name}</span>
                    </div>
                  )}
                  
                  {book.department && (
                    <div>
                      <span className="font-semibold text-gray-900">Department:</span>
                      <span className="ml-2 text-gray-600">{book.department}</span>
                    </div>
                  )}
                  
                  {book.course_code && (
                    <div>
                      <span className="font-semibold text-gray-900">Course Code:</span>
                      <span className="ml-2 text-gray-600">{book.course_code}</span>
                    </div>
                  )}
                  
                  {book.isbn && (
                    <div>
                      <span className="font-semibold text-gray-900">ISBN:</span>
                      <span className="ml-2 text-gray-600">{book.isbn}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books Section (to be implemented) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          {/* Placeholder for related books */}
          <div className="text-center py-8 text-gray-500">
            Related books will be displayed here
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;