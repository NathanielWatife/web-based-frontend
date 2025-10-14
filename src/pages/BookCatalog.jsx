import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  debounce
} from '@mui/material';
import BookList from '../components/books/BookList';
import BookSearch from '../components/books/BookSearch';
import BookFilters from '../components/books/BookFilters';
import { bookService } from '../services/bookService';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState('title');
  const [categories, setCategories] = useState([]);

  // Fetch books with debounced search
  const fetchBooks = useCallback(
    debounce(async (search, category, price, sort) => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (price[0] > 0) params.minPrice = price[0];
        if (price[1] < 20000) params.maxPrice = price[1];
        if (sort) params.sort = sort;

        const response = await bookService.getAllBooks(params);
        setBooks(response.books || response);
        
        // Extract unique categories from books
        if (response.books) {
          const uniqueCategories = [...new Set(response.books.map(book => book.category))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchBooks(searchTerm, selectedCategory, priceRange, sortBy);
  }, [searchTerm, selectedCategory, priceRange, sortBy, fetchBooks]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Catalog
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Browse our collection of academic books and materials
      </Typography>

      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <BookFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </Grid>

        {/* Books List */}
        <Grid item xs={12} md={9}>
          <BookSearch onSearch={handleSearch} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {books.length} books
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </Typography>
          </Box>

          <BookList books={books} loading={loading} error={error} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookCatalog;