import React, { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService';
import BookCard from './BookCard';
import LoadingSpinner from '../common/LoadingSpinner';
import BookCardSkeleton from './BookCardSkeleton';
import '../../styles/BookList.css';
import RecommendedBooks from './RecommendedBooks';
import { useAuth } from '../../context/AuthContext';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    forMyLevel: false
  });

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      if (filters.forMyLevel && isAuthenticated && user?.level) {
        params.level = user.level;
      }

  const response = await bookService.getAllBooks(params);
  const list = Array.isArray(response.data?.data) ? response.data.data : [];
  setBooks(list);
    } catch (error) {
      setError('Failed to load books');
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="book-list-container">
        <div className="filters-section" style={{ opacity: 0.6 }}>
          <div className="search-box">
            <input type="text" className="form-input" placeholder="Search books..." disabled />
          </div>
          <div className="filter-controls">
            <select className="form-select" disabled><option>Loading…</option></select>
            <input type="number" className="form-input" placeholder="Min Price" disabled />
            <input type="number" className="form-input" placeholder="Max Price" disabled />
            <label className="checkbox" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" disabled />
              <span>Show books for my level</span>
            </label>
          </div>
        </div>
        <div className="books-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-list-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!Array.isArray(books)) {
    return (
      <div className="book-list-container">
        <div className="error-message">Unexpected response format.</div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      {isAuthenticated && (
        <div style={{ marginBottom: 24 }}>
          <RecommendedBooks title="Top picks for your level" />
        </div>
      )}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search books..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="form-select"
          >
            <option value="">All Categories</option>
            <option value="Science & Technology">Science & Technology</option>
            <option value="Business & Economics">Business & Economics</option>
            <option value="Engineering">Engineering</option>
            <option value="Arts & Humanities">Arts & Humanities</option>
            <option value="Computer Science">Computer Science</option>
          </select>
          
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="form-input"
          />
          
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="form-input"
          />

          <label className="checkbox" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={filters.forMyLevel}
              onChange={(e) => handleFilterChange('forMyLevel', e.target.checked)}
              disabled={!isAuthenticated || !user?.level}
            />
            <span>Show books for my level</span>
          </label>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <h3>No books found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;