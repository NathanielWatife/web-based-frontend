import React, { useState } from 'react';
import { BOOK_CATEGORIES, FACULTIES } from '../../utils/constants';
import '../../styles/AdvancedSearch.css';

const AdvancedSearch = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    faculty: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'title'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      faculty: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'title'
    });
    setSearchTerm('');
    onFilter({});
    onSearch('');
  };

  return (
    <div className="advanced-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books by title, author, or ISBN..."
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      <div className="filter-section">
        <h4>Filters</h4>
        
        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {BOOK_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Faculty</label>
            <select
              value={filters.faculty}
              onChange={(e) => handleFilterChange('faculty', e.target.value)}
              className="filter-select"
            >
              <option value="">All Faculties</option>
              {FACULTIES.map(faculty => (
                <option key={faculty} value={faculty}>{faculty}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="price-input"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="price-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="title">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="date">Newest First</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
            />
            In Stock Only
          </label>
          
          <button onClick={clearFilters} className="btn btn-outline">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;