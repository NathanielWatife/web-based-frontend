import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import BookCard from './BookCard';
import LoadingSpinner from '../common/LoadingSpinner';

const BookList = ({ books, loading, error }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error" variant="h6">
          Error loading books: {error}
        </Typography>
      </Box>
    );
  }

  if (!books || books.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No books found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filters
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {books.map((book) => (
        <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;