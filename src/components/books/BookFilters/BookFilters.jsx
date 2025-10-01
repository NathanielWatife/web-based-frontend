import React, { useState } from 'react';
import './BookFilters.css';

const BookFilters = ({ categories, onFilterChange, currentFilters, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [filters, setFilters] = useState({
    category: currentFilters.category || '',
    price_min: currentFilters.price_min || '',
    price_max: currentFilters.price_max || '',
    sort: currentFilters.sort || 'title',
    availability: currentFilters.availability || 'all',
    publisher: currentFilters.publisher || ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: '',
      price_min: '',
      price_max: '',
      sort: 'title',
      availability: 'all',
      publisher: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return filters.category || filters.price_min || filters.price_max || 
           filters.availability !== 'all' || filters.publisher;
  };

  const publishers = [
    'Tech Publishers',
    'Math Press',
    'Science House',
    'Business Books',
    'Academic Press',
    'Engineering Publications'
  ];

  return (
    <div className="book-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <div className="header-actions">
          {hasActiveFilters() && (
            <button 
              className="clear-filters-btn"
              onClick={handleClearFilters}
              title="Clear all filters"
            >
              Clear All
            </button>
          )}
          <button 
            className="toggle-filters-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Sort Options */}
        <div className="filter-group">
          <label htmlFor="sort">Sort By</label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="title">Title A-Z</option>
            <option value="-title">Title Z-A</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-stock_quantity">Most Popular</option>
            <option value="publication_year">Newest First</option>
            <option value="-publication_year">Oldest First</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label>Price Range (₦)</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={filters.price_min}
              onChange={(e) => handleFilterChange('price_min', e.target.value)}
              min="0"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.price_max}
              onChange={(e) => handleFilterChange('price_max', e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Availability */}
        <div className="filter-group">
          <label>Availability</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="availability"
                value="all"
                checked={filters.availability === 'all'}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              />
              <span className="radio-custom"></span>
              All Books
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="availability"
                value="in_stock"
                checked={filters.availability === 'in_stock'}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              />
              <span className="radio-custom"></span>
              In Stock
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="availability"
                value="low_stock"
                checked={filters.availability === 'low_stock'}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              />
              <span className="radio-custom"></span>
              Low Stock
            </label>
          </div>
        </div>

        {/* Publisher */}
        <div className="filter-group">
          <label htmlFor="publisher">Publisher</label>
          <select
            id="publisher"
            value={filters.publisher}
            onChange={(e) => handleFilterChange('publisher', e.target.value)}
          >
            <option value="">All Publishers</option>
            {publishers.map(publisher => (
              <option key={publisher} value={publisher}>
                {publisher}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="filter-tags">
              {filters.category && (
                <span className="filter-tag">
                  Category: {categories.find(c => c.id.toString() === filters.category)?.name}
                  <button onClick={() => handleFilterChange('category', '')}>×</button>
                </span>
              )}
              {(filters.price_min || filters.price_max) && (
                <span className="filter-tag">
                  Price: {filters.price_min || '0'} - {filters.price_max || 'Any'}
                  <button onClick={() => {
                    handleFilterChange('price_min', '');
                    handleFilterChange('price_max', '');
                  }}>×</button>
                </span>
              )}
              {filters.availability !== 'all' && (
                <span className="filter-tag">
                  {filters.availability === 'in_stock' ? 'In Stock' : 'Low Stock'}
                  <button onClick={() => handleFilterChange('availability', 'all')}>×</button>
                </span>
              )}
              {filters.publisher && (
                <span className="filter-tag">
                  Publisher: {filters.publisher}
                  <button onClick={() => handleFilterChange('publisher', '')}>×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookFilters;