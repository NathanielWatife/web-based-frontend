import React, { useState, useEffect } from 'react';
import { useReviews } from '../../../contexts/ReviewsContext';
import { useAuth } from '../../../contexts/AuthContext';
import ReviewCard from '../ReviewCard/ReviewCard';
import ReviewForm from '../ReviewForm/ReviewForm';
import StarRating from '../StarRating/StarRating';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './ReviewsSection.css';

const ReviewsSection = ({ bookId }) => {
  const { 
    reviews, 
    getBookReviews, 
    addReview, 
    updateReview, 
    deleteReview, 
    getBookRatingStats,
    hasUserReviewed,
    loading 
  } = useReviews();
  
  const { isAuthenticated } = useAuth();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  const bookReviews = reviews[bookId] || [];
  const ratingStats = getBookRatingStats(bookId);

  useEffect(() => {
    getBookReviews(bookId);
  }, [bookId]);

  const handleSubmitReview = async (reviewData) => {
    try {
      let result;
      
      if (editingReview) {
        result = await updateReview(editingReview.id, reviewData);
      } else {
        result = await addReview(bookId, reviewData);
      }

      if (result.success) {
        setShowReviewForm(false);
        setEditingReview(null);
        // Refresh reviews
        await getBookReviews(bookId);
      } else {
        alert(result.message || 'Failed to submit review');
      }
    } catch (error) {
      alert(error.message || 'Failed to submit review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const result = await deleteReview(reviewId, bookId);
      if (result.success) {
        // Reviews are automatically updated in context
      } else {
        alert(result.message || 'Failed to delete review');
      }
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const sortedReviews = [...bookReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'helpful':
        return b.helpful_count - a.helpful_count;
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const userHasReviewed = hasUserReviewed(bookId);

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="rating-overview">
            <div className="average-rating">
              <span className="rating-number">{ratingStats.average}</span>
              <StarRating rating={ratingStats.average} readonly size="large" showLabel />
              <span className="total-reviews">{ratingStats.total} review{ratingStats.total !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingStats.distribution[rating];
                const percentage = ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
                
                return (
                  <div key={rating} className="distribution-row">
                    <span className="rating-label">{rating} star</span>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="distribution-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {isAuthenticated && !userHasReviewed && !showReviewForm && (
            <div className="write-review-cta">
              <h3>Share Your Experience</h3>
              <p>Help other students by sharing your thoughts about this book</p>
              <button 
                className="btn btn-primary btn-large"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      {(showReviewForm || editingReview) && (
        <ReviewForm
          bookId={bookId}
          existingReview={editingReview}
          onSubmit={handleSubmitReview}
          onCancel={handleCancelReview}
          loading={loading}
        />
      )}

      {/* Reviews List */}
      {bookReviews.length > 0 ? (
        <div className="reviews-list">
          <div className="reviews-controls">
            <div className="sort-options">
              <label htmlFor="sort-reviews">Sort by:</label>
              <select
                id="sort-reviews"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
            <div className="reviews-count">
              Showing {sortedReviews.length} review{sortedReviews.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="reviews-grid">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                bookId={bookId}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        </div>
      ) : (
        !showReviewForm && (
          <div className="no-reviews">
            <div className="no-reviews-icon">💬</div>
            <h3>No Reviews Yet</h3>
            <p>Be the first to share your experience with this book!</p>
            {isAuthenticated && !userHasReviewed && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowReviewForm(true)}
              >
                Write the First Review
              </button>
            )}
          </div>
        )
      )}

      {loading && <LoadingSpinner text="Loading reviews..." />}
    </div>
  );
};

export default ReviewsSection;