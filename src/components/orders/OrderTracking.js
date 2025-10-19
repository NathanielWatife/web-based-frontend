import React from 'react';
import { ORDER_STATUS } from '../../utils/constants';
import '../../styles/OrderTracking.css';

const OrderTracking = ({ order }) => {
  const statusSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'ready-for-pickup', label: 'Ready for Pickup' },
    { key: 'completed', label: 'Completed' }
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.key === order.status);

  return (
    <div className="order-tracking">
      <h3>Order Tracking</h3>
      <div className="tracking-timeline">
        {statusSteps.map((step, index) => (
          <div 
            key={step.key}
            className={`timeline-step ${index <= currentStatusIndex ? 'completed' : ''} ${index === currentStatusIndex ? 'current' : ''}`}
          >
            <div className="step-indicator">
              <div className="step-icon">
                {index <= currentStatusIndex ? '✓' : index + 1}
              </div>
            </div>
            <div className="step-info">
              <div className="step-label">{step.label}</div>
              {index === currentStatusIndex && (
                <div className="step-status">Current Status</div>
              )}
            </div>
            {index < statusSteps.length - 1 && (
              <div className={`step-connector ${index < currentStatusIndex ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="tracking-details">
        <div className="detail-item">
          <strong>Order ID:</strong> {order.orderId}
        </div>
        <div className="detail-item">
          <strong>Current Status:</strong> 
          <span 
            className="status-badge"
            style={{ backgroundColor: ORDER_STATUS[order.status].color }}
          >
            {ORDER_STATUS[order.status].label}
          </span>
        </div>
        <div className="detail-item">
          <strong>Last Updated:</strong> {new Date(order.updatedAt).toLocaleString()}
        </div>
        {order.deliveryOption === 'pickup' && (
          <div className="detail-item">
            <strong>Pickup Location:</strong> College Library, Main Campus
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;