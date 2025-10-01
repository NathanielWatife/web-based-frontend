import React, { createContext, useState, useContext } from 'react';
import { reviewsAPI } from '../services/api/reviewsAPI';
import { useAuth } from './AuthContext';

const ReviewsContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const getBookReviews = async (bookId) => {
    try {
      setLoading(true);
      // Simulate API call
      const mockReviews = generateMockReviews(bookId);
      setReviews(prev => ({
        ...prev,
        [bookId]: mockReviews
      }));
      return mockReviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateMockReviews = (bookId) => {
    const mockReviews = [
      {
        id: 1,
        book: bookId,
        user: {
          id: 1,
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@student.yabatech.edu.ng'
        },
        rating: 5,
        title: 'Excellent Resource!',
        comment: 'This book was incredibly helpful for my computer science course. The explanations are clear and the examples are practical.',
        created_at: '2024-01-15T10:30:00Z',
        helpful_count: 12
      },
      {
        id: 2,
        book: bookId,
        user: {
          id: 2,
          first_name: 'Mike',
          last_name: 'Chen',
          email: 'mike.chen@student.yabatech.edu.ng'
        },
        rating: 4,
        title: 'Very Comprehensive',
        comment: 'Great book covering all the fundamentals. Some sections could use more examples, but overall very good.',
        created_at: '2024-01-12T14:20:00Z',
        helpful_count: 8
      },
      {
        id: 3,
        book: bookId,
        user: {
          id: 3,
          first_name: 'Amina',
          last_name: 'Okafor',
          email: 'amina.okafor@student.yabatech.edu.ng'
        },
        rating: 5,
        title: 'Perfect for Beginners',
        comment: 'As someone new to programming, this book made complex concepts easy to understand. Highly recommended!',
        created_at: '2024-01-10T09:15:00Z',
        helpful_count: 15
      }
    ];
    return mockReviews;
  };

  const addReview = async (bookId, reviewData) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to submit a review');
    }

    try {
      setLoading(true);
      
      // Simulate API call
      const newReview = {
        id: Date.now(),
        book: bookId,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        },
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        created_at: new Date().toISOString(),
        helpful_count: 0
      };

      setReviews(prev => ({
        ...prev,
        [bookId]: [newReview, ...(prev[bookId] || [])]
      }));

      return { success: true, review: newReview };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to submit review' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    try {
      setLoading(true);
      // Simulate API call
      // Update logic would go here
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update review' 
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId, bookId) => {
    try {
      setLoading(true);
      // Simulate API call
      setReviews(prev => ({
        ...prev,
        [bookId]: (prev[bookId] || []).filter(review => review.id !== reviewId)
      }));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete review' 
      };
    } finally {
      setLoading(false);
    }
  };

  const markHelpful = async (reviewId, bookId) => {
    try {
      setLoading(true);
      // Simulate API call
      setReviews(prev => ({
        ...prev,
        [bookId]: (prev[bookId] || []).map(review => 
          review.id === reviewId 
            ? { ...review, helpful_count: review.helpful_count + 1, user_has_helped: true }
            : review
        )
      }));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to mark as helpful' 
      };
    } finally {
      setLoading(false);
    }
  };

  const getBookRatingStats = (bookId) => {
    const bookReviews = reviews[bookId] || [];
    if (bookReviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = bookReviews.length;
    const sum = bookReviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    bookReviews.forEach(review => {
      distribution[review.rating]++;
    });

    return {
      average: Math.round(average * 10) / 10,
      total,
      distribution
    };
  };

  const hasUserReviewed = (bookId) => {
    if (!isAuthenticated) return false;
    const bookReviews = reviews[bookId] || [];
    return bookReviews.some(review => review.user.id === user.id);
  };

  const value = {
    reviews,
    getBookReviews,
    addReview,
    updateReview,
    deleteReview,
    markHelpful,
    getBookRatingStats,
    hasUserReviewed,
    loading
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};