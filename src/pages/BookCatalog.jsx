import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { booksAPI } from '../services/books';
import BookGrid from '../components/books/BookGrid';
import BookSearch from '../components/books/BookSearch';
import BookFilters from '../components/books/BookFilters';
import Pagination from '../components/shared/Pagination';

const BookCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    department: searchParams.get('department') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') === 'true',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Fetch books with current filters
  const { data: booksData, loading, error, refetch } = useApi(
    () => booksAPI.getAllBooks(filters),
    null,
    [filters]
  );

  // Fetch categories for filters
  const { data: categoriesData } = useApi(booksAPI.getCategories);

  // Common departments (you might want to fetch these from API)
  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Accountancy',
    'Business Administration',
    'Mass Communication',
    'Science Laboratory Technology',
    'Estate Management',
    'Architecture'
  ];

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== false) {
        newParams.set(key, value.toString());
      }
    });
    
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Catalog</h1>
          <p className="text-gray-600">
            Browse our collection of academic books and resources
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <BookSearch onSearch={handleSearch} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <BookFilters
              categories={categoriesData || []}
              departments={departments}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Books Grid */}
          <div className="lg:w-3/4">
            {/* Results Info */}
            {booksData && (
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {booksData.results?.length || 0} of {booksData.count || 0} books
                </p>
                
                {/* Sort Options (to be implemented) */}
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="title">Sort by Title</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            )}

            <BookGrid
              books={booksData?.results || []}
              loading={loading}
              error={error}
            />

            {/* Pagination */}
            {booksData && booksData.total_pages > 1 && (
              <Pagination
                currentPage={filters.page}
                totalPages={booksData.total_pages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCatalog;