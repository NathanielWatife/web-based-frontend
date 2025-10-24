import React from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import '../../styles/OrderSummary.css';

const OrderSummary = ({ order }) => {
  return (
    <div className="order-summary">
      <div className="order-header">
        <div className="order-info">
          <h3>Order #{order.orderId}</h3>
          <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="order-status">
          <span 
            className="status-badge"
            style={{ backgroundColor: ORDER_STATUS[order.status].color }}
          >
            {ORDER_STATUS[order.status].label}
          </span>
        </div>
      </div>

      <div className="order-items">
        <h4>Items ({order.items.length})</h4>
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-image">
              <img 
                src={item.book?.imageUrl || item.book?.image || '/placeholder-book.jpg'} 
                alt={item.book?.title}
              />
            </div>
            <div className="item-details">
              <h5>{item.book?.title}</h5>
              <p>by {item.book?.author}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div className="item-price">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="order-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
        <div className="total-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="total-row grand-total">
          <span>Total:</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="order-delivery">
        <h4>Delivery Information</h4>
        <p><strong>Method:</strong> {order.deliveryOption === 'pickup' ? 'Campus Pickup' : 'Home Delivery'}</p>
        {order.deliveryAddress && (
          <p><strong>Address:</strong> {order.deliveryAddress}</p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;