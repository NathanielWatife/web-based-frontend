import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        py: 3,
        mt: 'auto',
        borderTop: '1px solid #e0e0e0'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} YabaTech Bookstore. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Yaba College of Technology
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;