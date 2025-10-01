import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const book = item.book;
  const quantity = item.quantity;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      await updateQuantity(book.id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeFromCart(book.id);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemoving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const subtotal = book.price * quantity;

  return (
    <div className={`cart-item ${removing ? 'removing' : ''}`}>
      <div className="cart-item-image">
        <Link to={`/books/${book.id}`}>
          {book.cover_image ? (
            <img src={book.cover_image} alt={book.title} />
          ) : (
            <div className="book-image-placeholder-small">
              <span>No Image</span>
            </div>
          )}
        </Link>
      </div>

      <div className="cart-item-details">
        <Link to={`/books/${book.id}`} className="cart-item-title">
          <h3>{book.title}</h3>
        </Link>
        <p className="cart-item-author">by {book.author}</p>
        <p className="cart-item-price">{formatPrice(book.price)}</p>
        
        {book.stock_quantity < quantity && (
          <p className="stock-warning">
            Only {book.stock_quantity} available in stock
          </p>
        )}
      </div>

      <div className="cart-item-controls">
        <div className="quantity-control">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={updating || quantity <= 1}
            className="quantity-btn"
          >
            −
          </button>
          <span className="quantity-display">
            {updating ? '...' : quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={updating || quantity >= book.stock_quantity}
            className="quantity-btn"
          >
            +
          </button>
        </div>

        <div className="cart-item-subtotal">
          {formatPrice(subtotal)}
        </div>

        <button
          onClick={handleRemove}
          disabled={removing}
          className="remove-btn"
          title="Remove item"
        >
          {removing ? '...' : '🗑️'}
        </button>
      </div>
    </div>
  );
};

export default CartItem;