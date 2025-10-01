import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import BookCard from '../../components/books/BookCard/BookCard';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to view your wishlist.</p>
            <div className="auth-actions">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <LoadingSpinner text="Loading your wishlist..." />
        </div>
      </div>
    );
  }

  const handleMoveToCart = async (bookId) => {
    const result = await moveToCart(bookId, { addToCart });
    if (result.success) {
      // You can add a toast notification here
      console.log('Moved to cart successfully');
    } else {
      alert(result.message || 'Failed to move item to cart');
    }
  };

  const handleMoveAllToCart = async () => {
    for (const item of wishlistItems) {
      await moveToCart(item.book.id, { addToCart });
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist();
    }
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div className="header-content">
            <h1>My Wishlist</h1>
            <p>Save books you're interested in for later</p>
          </div>
          
          {wishlistItems.length > 0 && (
            <div className="wishlist-actions">
              <button
                onClick={handleMoveAllToCart}
                className="btn btn-primary"
                disabled={loading}
              >
                Move All to Cart
              </button>
              <button
                onClick={handleClearWishlist}
                className="btn btn-outline"
                disabled={loading}
              >
                Clear Wishlist
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding books you love to your wishlist!</p>
            <Link to="/books" className="btn btn-primary btn-large">
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-stats">
              <div className="stat">
                <span className="count">{wishlistItems.length}</span>
                <span className="label">Books in Wishlist</span>
              </div>
              <div className="stat">
                <span className="count">
                  ₦{wishlistItems.reduce((total, item) => total + item.book.price, 0).toLocaleString()}
                </span>
                <span className="label">Total Value</span>
              </div>
            </div>

            <div className="wishlist-grid">
              {wishlistItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <BookCard book={item.book} />
                  <div className="wishlist-item-actions">
                    <button
                      onClick={() => handleMoveToCart(item.book.id)}
                      className="btn btn-primary btn-small"
                      disabled={loading}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.book.id)}
                      className="btn btn-outline btn-small"
                      disabled={loading}
                      title="Remove from wishlist"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="wishlist-footer">
              <p>
                You have {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist.
              </p>
              <div className="footer-actions">
                <Link to="/books" className="btn btn-outline">
                  Continue Shopping
                </Link>
                <button
                  onClick={handleMoveAllToCart}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Add All to Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;