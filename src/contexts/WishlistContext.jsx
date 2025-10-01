import React, { createContext, useState, useContext, useEffect } from 'react';
import { wishlistAPI } from '../services/api/wishlistAPI';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      // Load wishlist from localStorage for guest users
      const savedWishlist = localStorage.getItem('guestWishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlistItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (book) => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.addToWishlist({ book_id: book.id });
        await fetchWishlist(); // Refresh wishlist
      } else {
        // For guest users, update local storage
        const updatedWishlist = [...wishlistItems];
        const existingItem = updatedWishlist.find(item => item.book.id === book.id);
        
        if (!existingItem) {
          updatedWishlist.push({
            id: Date.now(), // Temporary ID for guest
            book: book,
            added_date: new Date().toISOString()
          });
          
          setWishlistItems(updatedWishlist);
          localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
        }
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to wishlist' 
      };
    }
  };

  const removeFromWishlist = async (bookId) => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.removeFromWishlist(bookId);
        await fetchWishlist();
      } else {
        const updatedWishlist = wishlistItems.filter(item => item.book.id !== bookId);
        setWishlistItems(updatedWishlist);
        localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from wishlist' 
      };
    }
  };

  const moveToCart = async (bookId, cartContext) => {
    try {
      // Add to cart
      const cartResult = await cartContext.addToCart(bookId, 1);
      if (cartResult.success) {
        // Remove from wishlist
        await removeFromWishlist(bookId);
        return { success: true };
      }
      return cartResult;
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to move item to cart' 
      };
    }
  };

  const isInWishlist = (bookId) => {
    return wishlistItems.some(item => item.book.id === bookId);
  };

  const clearWishlist = async () => {
    try {
      if (isAuthenticated) {
        await wishlistAPI.clearWishlist();
      }
      setWishlistItems([]);
      localStorage.removeItem('guestWishlist');
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear wishlist' 
      };
    }
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist,
    clearWishlist,
    loading,
    fetchWishlist,
    wishlistCount: wishlistItems.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};