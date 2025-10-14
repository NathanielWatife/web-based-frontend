import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper
} from '@mui/material';
import { formatPrice } from '../../utils/helpers';

const BookFilters = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange
}) => {
  const marks = [
    { value: 0, label: formatPrice(0) },
    { value: 10000, label: formatPrice(10000) },
    { value: 20000, label: formatPrice(20000) },
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Category Filter */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price Range Filter */}
        <Box>
          <Typography gutterBottom>
            Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => onPriceRangeChange(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatPrice(value)}
            min={0}
            max={20000}
            step={500}
            marks={marks}
          />
        </Box>

        {/* Sort Filter */}
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => onSortChange(e.target.value)}
          >
            <MenuItem value="title">Title A-Z</MenuItem>
            <MenuItem value="-title">Title Z-A</MenuItem>
            <MenuItem value="price">Price: Low to High</MenuItem>
            <MenuItem value="-price">Price: High to Low</MenuItem>
            <MenuItem value="author">Author A-Z</MenuItem>
            <MenuItem value="-createdAt">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default BookFilters;