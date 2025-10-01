import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ 
  rating, 
  onRatingChange, 
  size = 'medium', 
  readonly = false,
  showLabel = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`star-rating ${size} ${readonly ? 'readonly' : ''}`}>
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= displayRating ? 'active' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            title={`${star} star${star !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
      {showLabel && rating > 0 && (
        <span className="rating-label">
          {rating.toFixed(1)} out of 5
        </span>
      )}
    </div>
  );
};

export default StarRating;