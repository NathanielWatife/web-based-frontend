import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import './BookCard.css';
import WishlistButton from '../WishlistButton/WishlistButton';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = await addToCart(book.id, 1);
    if (result.success) {
      // You can add a toast notification here later
      console.log('Book added to cart!');
    } else {
      console.error('Failed to add book to cart:', result.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  return (
    <div className="book-card">
      <Link to={`/books/${book.id}`} className="book-card-link">
        <div className="book-image">
          <WishlistButton book={book} size="small" />
          {book.cover_image ? (
            <img src={book.cover_image} alt={book.title} />
          ) : (
            <div className="book-image-placeholder">
              <span>No Image</span>
            </div>
          )}
          {book.stock_quantity === 0 && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}
        </div>
        
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <p className="book-price">{formatPrice(book.price)}</p>
          
          {book.stock_quantity > 0 && (
            <div className="book-actions">
              <button 
                className="btn btn-primary btn-small"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BookCard;