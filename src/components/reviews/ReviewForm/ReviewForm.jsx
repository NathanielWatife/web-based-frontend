import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import StarRating from '../StarRating/StarRating';
import './ReviewForm.css';

const ReviewForm = ({ bookId, existingReview, onSubmit, onCancel, loading }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rating) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (formData.comment.length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getRatingDescription = (rating) => {
    const descriptions = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return descriptions[rating] || 'Select Rating';
  };

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <h3>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
        <p>Share your thoughts about this book with other students</p>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        {/* Rating Selection */}
        <div className="form-group">
          <label htmlFor="rating">Your Rating *</label>
          <div className="rating-section">
            <StarRating
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size="large"
            />
            <span className="rating-description">
              {formData.rating ? getRatingDescription(formData.rating) : 'Select Rating'}
            </span>
          </div>
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>

        {/* Review Title */}
        <div className="form-group">
          <label htmlFor="title">Review Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Summarize your review in a few words"
            maxLength="100"
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
          <div className="char-count">
            {formData.title.length}/100 characters
          </div>
        </div>

        {/* Review Comment */}
        <div className="form-group">
          <label htmlFor="comment">Your Review *</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className={errors.comment ? 'error' : ''}
            placeholder="Share details of your experience with this book. What did you like or dislike? Would you recommend it to others?"
            rows="6"
            maxLength="1000"
          />
          {errors.comment && <span className="error-text">{errors.comment}</span>}
          <div className="char-count">
            {formData.comment.length}/1000 characters
          </div>
        </div>

        {/* Review Tips */}
        <div className="review-tips">
          <h4>Writing a Great Review</h4>
          <ul>
            <li>Describe your experience with the book</li>
            <li>Mention what you liked or disliked</li>
            <li>Note if it was helpful for your studies</li>
            <li>Be honest and specific</li>
          </ul>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;