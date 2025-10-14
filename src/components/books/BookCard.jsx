import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import { getBookCoverPlaceholder } from '../../utils/placeholders';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book, 1);
  };

  const handleImageError = (e) => {
    e.target.src = getBookCoverPlaceholder(book.title);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={book.imageUrl || getBookCoverPlaceholder(book.title)}
        alt={book.title}
        sx={{ objectFit: 'cover' }}
        onError={handleImageError}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {book.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          by {book.author}
        </Typography>

        <Chip 
          label={book.category} 
          size="small" 
          sx={{ mb: 1, alignSelf: 'flex-start' }}
          color="primary"
          variant="outlined"
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ISBN: {book.isbn}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatPrice(book.price)}
            </Typography>
            
            <Typography 
              variant="body2" 
              color={book.stockQuantity > 0 ? 'success.main' : 'error.main'}
            >
              {book.stockQuantity > 0 ? `${book.stockQuantity} in stock` : 'Out of stock'}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<AddShoppingCart />}
            onClick={handleAddToCart}
            disabled={book.stockQuantity === 0}
            size="small"
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCard;