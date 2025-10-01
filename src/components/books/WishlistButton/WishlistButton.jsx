import React, { useState } from 'react';
import { useWishlist } from '../../../contexts/WishlistContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './WishlistButton.css';

const WishlistButton = ({ book, size = 'medium' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isWishlisted = isInWishlist(book.id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setLoading(true);
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(book.id);
      } else {
        await addToWishlist(book);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`wishlist-btn ${size} ${isWishlisted ? 'wishlisted' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleWishlistToggle}
      disabled={loading}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className="wishlist-icon">
        {loading ? '⋯' : (isWishlisted ? '❤️' : '🤍')}
      </span>
    </button>
  );
};

export default WishlistButton;