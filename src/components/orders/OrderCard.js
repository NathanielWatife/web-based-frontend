import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import '../../styles/OrderCard.css';

const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-meta">
          <h3 className="order-id">
            <Link to={`/orders/${order._id}`}>Order #{order.orderId}</Link>
          </h3>
          <p className="order-date">{formatDate(order.createdAt)}</p>
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

      <div className="order-items-preview">
        {order.items.slice(0, 3).map((item, index) => (
          <div key={index} className="preview-item">
            <div className="preview-image">
              <img 
                src={item.book?.imageUrl || item.book?.image || '/placeholder-book.jpg'} 
                alt={item.book?.title}
              />
            </div>
            <div className="preview-details">
              <p className="preview-title">{item.book?.title}</p>
              <p className="preview-quantity">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="more-items">
            +{order.items.length - 3} more items
          </div>
        )}
      </div>

      <div className="order-card-footer">
        <div className="order-total">
          Total: {formatCurrency(order.totalAmount)}
        </div>
        <div className="order-actions">
          <Link to={`/orders/${order._id}`} className="btn btn-outline">
            View Details
          </Link>
          {order.status === 'pending' && (
            <button className="btn btn-danger">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;