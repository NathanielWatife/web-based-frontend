import React from 'react';
import '../../styles/BookCard.css';
import '../../styles/Skeleton.css';

const BookCardSkeleton = () => {
  return (
    <div className="book-card skeleton">
      <div className="book-image skeleton-box" style={{ height: 180 }} />
      <div className="book-info">
        <div className="skeleton-box" style={{ width: '70%', height: 18, marginBottom: 8 }} />
        <div className="skeleton-box" style={{ width: '50%', height: 14, marginBottom: 12 }} />
        <div className="skeleton-box" style={{ width: '40%', height: 16 }} />
      </div>
    </div>
  );
};

export default BookCardSkeleton;
