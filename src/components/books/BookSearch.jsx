import React, { useState } from 'react';
import {
  TextField,
  Box,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';

const BookSearch = ({ onSearch, placeholder = "Search books..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />
    </Box>
  );
};

export default BookSearch;