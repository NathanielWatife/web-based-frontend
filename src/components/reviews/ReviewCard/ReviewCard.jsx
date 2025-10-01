import React, { useState } from 'react';
import { useReviews } from '../../../contexts/ReviewsContext';
import { useAuth } from '../../../contexts/AuthContext';
import StarRating from '../StarRating/StarRating';
import './ReviewCard.css';

const ReviewCard = ({ review, bookId, onEdit, onDelete }) => {
  const { markHelpful, loading } = useReviews();
  const { user } = useAuth();
  const [isHelpful, setIsHelpful] = useState(review.user_has_helped || false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);

  const isOwnReview = user && review.user.id === user.id;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleHelpfulClick = async () => {
    if (isOwnReview) return;

    try {
      const result = await markHelpful(review.id, bookId);
      if (result.success) {
        setIsHelpful(true);
        setHelpfulCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(review);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this review?')) {
      onDelete(review.id);
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.user.first_name?.charAt(0)}{review.user.last_name?.charAt(0)}
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">
              {review.user.first_name} {review.user.last_name}
            </h4>
            <div className="review-meta">
              <StarRating rating={review.rating} readonly size="small" />
              <span className="review-date">{formatDate(review.created_at)}</span>
            </div>
          </div>
        </div>

        {isOwnReview && (
          <div className="review-actions">
            <button
              className="btn-action edit"
              onClick={handleEdit}
              title="Edit review"
            >
              ✏️
            </button>
            <button
              className="btn-action delete"
              onClick={handleDelete}
              title="Delete review"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="review-content">
        {review.title && (
          <h5 className="review-title">{review.title}</h5>
        )}
        <p className="review-comment">{review.comment}</p>
      </div>

      <div className="review-footer">
        <button
          className={`helpful-btn ${isHelpful ? 'active' : ''} ${isOwnReview ? 'disabled' : ''}`}
          onClick={handleHelpfulClick}
          disabled={loading || isOwnReview || isHelpful}
        >
          <span className="helpful-icon">👍</span>
          Helpful ({helpfulCount})
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;