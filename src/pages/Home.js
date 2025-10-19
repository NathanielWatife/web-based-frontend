import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to YabaTech BookStore</h1>
            <p>Your one-stop destination for academic materials, textbooks, and educational resources.</p>
            <div className="hero-actions">
              <Link to="/books" className="btn btn-primary">
                Browse Books
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline">
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Our BookStore?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Wide Selection</h3>
              <p>Comprehensive collection of textbooks and academic materials for all departments.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Affordable Prices</h3>
              <p>Student-friendly prices with regular discounts and special offers.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Easy Pickup</h3>
              <p>Convenient on-campus pickup locations for quick access to your books.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Verified Quality</h3>
              <p>All books are verified for quality and authenticity before sale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <div className="container">
          <h2 className="section-title">Quick Access</h2>
          <div className="links-grid">
            <Link to="/books" className="link-card">
              <h3>Book Catalog</h3>
              <p>Browse our complete collection of books</p>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="link-card">
                  <h3>My Orders</h3>
                  <p>Track your orders and purchase history</p>
                </Link>
                <Link to="/profile" className="link-card">
                  <h3>My Profile</h3>
                  <p>Update your personal information</p>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="link-card">
                  <h3>Student Login</h3>
                  <p>Access your account with matric number</p>
                </Link>
                <Link to="/admin/login" className="link-card">
                  <h3>Admin Login</h3>
                  <p>Administrator access portal</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;