import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item._id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={item.image || '/placeholder-book.jpg'} 
          alt={item.title}
        />
      </div>
      
      <div className="cart-item-details">
        <h3 className="cart-item-title">
          <Link to={`/books/${item._id}`}>{item.title}</Link>
        </h3>
        <p className="cart-item-author">by {item.author}</p>
        <p className="cart-item-isbn">ISBN: {item.isbn}</p>
      </div>

      <div className="cart-item-price">
        {formatCurrency(item.price)}
      </div>

      <div className="cart-item-quantity">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="quantity-btn"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="quantity-display">{item.quantity}</span>
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="quantity-btn"
          disabled={item.quantity >= item.stock}
        >
          +
        </button>
      </div>

      <div className="cart-item-total">
        {formatCurrency(item.price * item.quantity)}
      </div>

      <div className="cart-item-actions">
        <button 
          onClick={handleRemove}
          className="btn btn-danger"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;