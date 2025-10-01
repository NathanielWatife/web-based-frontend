import React, { useState, useEffect } from 'react';
import './BookSearch.css';

const BookSearch = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Simple suggestion logic - you can enhance this with API calls
    if (value.length > 2) {
      // Mock suggestions - replace with actual API call
      const mockSuggestions = [
        'Computer Science',
        'Mathematics',
        'Engineering',
        'Business',
        'Literature'
      ].filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <div className="book-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for books, authors, or categories..."
            className="search-input"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
            >
              ✕
            </button>
          )}
          <button type="submit" className="search-button">
            🔍
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default BookSearch;