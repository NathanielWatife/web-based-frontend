import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../../services/api/booksAPI';
import BookCard from '../../components/books/BookCard/BookCard';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './Home.css';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  const fetchFeaturedBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getFeaturedBooks();
      setFeaturedBooks(response.data);
    } catch (error) {
      setError('Failed to load featured books');
      console.error('Error fetching featured books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Welcome to Yaba College Bookshop</h1>
              <p>Your one-stop destination for academic textbooks, course materials, and educational resources.</p>
              <div className="hero-actions">
                <Link to="/books" className="btn btn-primary btn-large">
                  Browse Books
                </Link>
                <Link to="/about" className="btn btn-secondary btn-large">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="placeholder-image">
                <span>Bookstore Illustration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Our Bookshop?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Wide Selection</h3>
              <p>Comprehensive collection of academic textbooks and reference materials</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery across campus and surrounding areas</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive pricing with student discounts and special offers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payments</h3>
              <p>Safe and secure payment options with multiple methods available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-books-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Books</h2>
            <Link to="/books" className="view-all-link">
              View All Books →
            </Link>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchFeaturedBooks} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : (
            <div className="featured-books-grid">
              {featuredBooks.slice(0, 6).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Next Textbook?</h2>
            <p>Browse our extensive collection of academic resources and get the books you need for your studies.</p>
            <Link to="/books" className="btn btn-primary btn-large">
              Explore Book Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;