import React, { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService';
import BookCard from './BookCard';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });

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

      const response = await bookService.getAllBooks(params);
      setBooks(response.data);
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
        <LoadingSpinner size="large" />
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

  return (
    <div className="book-list-container">
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