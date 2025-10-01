import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
          <div className="action-buttons">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/books" className="btn btn-outline">
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;