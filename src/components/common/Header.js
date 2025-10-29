import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import '../../styles/Header.css';

const Header = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h2>YabaTech BookStore</h2>
          </Link>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/books" className="nav-link">Books</Link>
            
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link to="/cart" className="nav-link cart-link">
                    Cart ({getCartItemsCount()})
                  </Link>
                )}
                <Link to="/orders" className="nav-link">Orders</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </nav>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;