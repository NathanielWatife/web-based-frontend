import React, { useState, useEffect } from 'react';
import { useReviews } from '../../contexts/ReviewsContext';
import { useAuth } from '../../contexts/AuthContext';
import ReviewCard from '../../components/reviews/ReviewCard/ReviewCard';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './MyReviews.css';

const MyReviews = () => {
  const { getUserReviews, deleteReview, loading } = useReviews();
  const { isAuthenticated } = useAuth();
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReviews();
    }
  }, [isAuthenticated]);

  const fetchUserReviews = async () => {
    try {
      // Simulate API call
      const mockReviews = generateMockUserReviews();
      setUserReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };

  const generateMockUserReviews = () => {
    return [
      {
        id: 1,
        book: {
          id: 1,
          title: 'Introduction to Computer Science',
          author: 'John Smith',
          cover_image: ''
        },
        rating: 5,
        title: 'Excellent Resource!',
        comment: 'This book was incredibly helpful for my computer science course.',
        created_at: '2024-01-15T10:30:00Z',
        helpful_count: 12
      },
      {
        id: 2,
        book: {
          id: 2,
          title: 'Advanced Calculus',
          author: 'Dr. Jane Wilson',
          cover_image: ''
        },
        rating: 4,
        title: 'Very Comprehensive',
        comment: 'Great book covering all the fundamentals.',
        created_at: '2024-01-12T14:20:00Z',
        helpful_count: 8
      }
    ];
  };

  const handleDeleteReview = async (reviewId, bookId) => {
    try {
      const result = await deleteReview(reviewId, bookId);
      if (result.success) {
        setUserReviews(prev => prev.filter(review => review.id !== reviewId));
      } else {
        alert(result.message || 'Failed to delete review');
      }
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="my-reviews-page">
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to view your reviews.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reviews-page">
      <div className="container">
        <div className="reviews-header">
          <h1>My Reviews</h1>
          <p>Manage and view all your book reviews</p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your reviews..." />
        ) : userReviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">💬</div>
            <h2>You haven't written any reviews yet</h2>
            <p>Start sharing your thoughts about the books you've read!</p>
          </div>
        ) : (
          <div className="reviews-list">
            <div className="reviews-stats">
              <div className="stat">
                <span className="count">{userReviews.length}</span>
                <span className="label">Total Reviews</span>
              </div>
              <div className="stat">
                <span className="count">
                  {userReviews.reduce((sum, review) => sum + review.helpful_count, 0)}
                </span>
                <span className="label">Helpful Votes</span>
              </div>
              <div className="stat">
                <span className="count">
                  {(userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)}
                </span>
                <span className="label">Average Rating</span>
              </div>
            </div>

            <div className="reviews-grid">
              {userReviews.map(review => (
                <div key={review.id} className="user-review-item">
                  <div className="book-info">
                    <h3>{review.book.title}</h3>
                    <p className="book-author">by {review.book.author}</p>
                  </div>
                  <ReviewCard
                    review={review}
                    bookId={review.book.id}
                    onDelete={handleDeleteReview}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;