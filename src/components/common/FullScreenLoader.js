import React from 'react';
import '../../styles/Overlay.css';
import LoadingSpinner from './LoadingSpinner';

const FullScreenLoader = ({ show = false, text = 'Please wait...' }) => {
  if (!show) return null;
  return (
    <div className="overlay-fullscreen">
      <div className="overlay-content">
        <LoadingSpinner size="large" />
        <div className="overlay-text">{text}</div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
