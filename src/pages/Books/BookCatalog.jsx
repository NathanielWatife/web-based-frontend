import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { booksAPI } from '../../services/api/booksAPI';
import BookCard from '../../components/books/BookCard/BookCard';
import BookSearch from '../../components/books/BookSearch/BookSearch';
import BookFilters from '../../components/books/BookFilters/BookFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import Pagination from '../../components/common/Pagination/Pagination';
import './BookCatalog.css';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 12
  });

  // Get filter values from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const priceMin = searchParams.get('price_min') || '';
  const priceMax = searchParams.get('price_max') || '';
  const sortBy = searchParams.get('sort') || 'title';

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [currentPage, searchQuery, categoryFilter, priceMin, priceMax, sortBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: pagination.pageSize,
        search: searchQuery,
        category: categoryFilter,
        price_min: priceMin,
        price_max: priceMax,
        ordering: sortBy
      };

      // Clean up undefined/null params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await booksAPI.getBooks(params);
      setBooks(response.data.results);
      setPagination(prev => ({
        ...prev,
        current: currentPage,
        total: response.data.count
      }));
    } catch (error) {
      setError('Failed to load books');
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await booksAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchParams({ q: query, page: 1 });
  };

  const handleFilterChange = (filters) => {
    const newParams = { ...filters, page: 1 };
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="book-catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>Book Catalog</h1>
          <p>Discover our extensive collection of academic textbooks and resources</p>
        </div>

        {/* Search and Filters */}
        <div className="catalog-controls">
          <div className="search-section">
            <BookSearch onSearch={handleSearch} initialQuery={searchQuery} />
          </div>
          
          <div className="filters-section">
            <BookFilters
              categories={categories}
              onFilterChange={handleFilterChange}
              currentFilters={{
                category: categoryFilter,
                price_min: priceMin,
                price_max: priceMax,
                sort: sortBy
              }}
              onClearFilters={clearFilters}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>
            Showing {books.length} of {pagination.total} books
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Books Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchBooks} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="no-results">
            <h3>No books found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="books-grid">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > pagination.pageSize && (
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookCatalog;