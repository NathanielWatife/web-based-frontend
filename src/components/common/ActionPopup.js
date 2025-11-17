import React from 'react';
import { useCart } from '../../context/CartContext';
import '../../styles/Overlay.css';

const ActionPopup = () => {
  const { actionPopup } = useCart();
  if (!actionPopup?.show) return null;

  return (
    <div className="overlay-blur">
      <div className="action-popup">
        <div className="action-popup-title">{actionPopup.title || 'Cart Updated'}</div>
        <div className="action-popup-message">{actionPopup.message}</div>
      </div>
    </div>
  );
};

export default ActionPopup;
