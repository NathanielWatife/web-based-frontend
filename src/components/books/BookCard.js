import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/BookCard.css';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book, 1);
  };

  return (
    <div className="book-card">
      <div className="book-image">
        <img 
          src={book.image || '/placeholder-book.jpg'} 
          alt={book.title}
          onError={(e) => {
            e.target.src = '/placeholder-book.jpg';
          }}
        />
      </div>
      
      <div className="book-content">
        <h3 className="book-title">
          <Link to={`/books/${book._id}`}>{book.title}</Link>
        </h3>
        
        <p className="book-author">by {book.author}</p>
        
        <div className="book-meta">
          <span className="book-category">{book.category}</span>
          <span className="book-isbn">ISBN: {book.isbn}</span>
        </div>
        
        <p className="book-description">
          {book.description?.substring(0, 100)}...
        </p>
        
        <div className="book-footer">
          <div className="book-price">
            {formatCurrency(book.price)}
          </div>
          
          <div className="book-actions">
            <Link to={`/books/${book._id}`} className="btn btn-outline">
              View Details
            </Link>
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary"
              disabled={book.stock === 0}
            >
              {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;