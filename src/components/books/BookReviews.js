import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/BookReviews.css';

const BookReviews = ({ bookId, reviews = [] }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { isAuthenticated, user } = useAuth();

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Submit review logic would go here
    console.log('Submitting review:', { rating, comment });
    setShowForm(false);
    setRating(5);
    setComment('');
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="book-reviews">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <span className="rating-stars">★★★★★</span>
            <span className="rating-count">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="add-review-section">
          {!showForm ? (
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="review-form">
              <h4>Write Your Review</h4>
              
              <div className="rating-input">
                <label>Rating:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${star <= rating ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-input"
                  rows="4"
                  placeholder="Share your thoughts about this book..."
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="empty-reviews">
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <strong>{review.user?.firstName} {review.user?.lastName}</strong>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookReviews;