import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Divider
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(item._id, item.quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(item._id, item.quantity - 1);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      updateQuantity(item._id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item._id);
  };

  const subtotal = item.price * item.quantity;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Book Image */}
          <Box
            component="img"
            src={item.imageUrl || '/placeholder-book.jpg'}
            alt={item.title}
            sx={{
              width: 80,
              height: 100,
              objectFit: 'cover',
              borderRadius: 1
            }}
          />

          {/* Book Details */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" noWrap>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {item.author}
            </Typography>
            <Typography variant="body1" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
              {formatPrice(item.price)}
            </Typography>
          </Box>

          {/* Quantity Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={handleDecrease} 
              size="small"
              disabled={item.quantity <= 1}
            >
              <Remove />
            </IconButton>
            
            <TextField
              value={item.quantity}
              onChange={handleQuantityChange}
              inputProps={{ 
                style: { textAlign: 'center', width: 50 },
                min: 1
              }}
              variant="outlined"
              size="small"
            />
            
            <IconButton onClick={handleIncrease} size="small">
              <Add />
            </IconButton>
          </Box>

          {/* Subtotal and Remove */}
          <Box sx={{ textAlign: 'right', minWidth: 120 }}>
            <Typography variant="h6" fontWeight="bold">
              {formatPrice(subtotal)}
            </Typography>
            <IconButton 
              onClick={handleRemove} 
              color="error" 
              size="small"
              sx={{ mt: 1 }}
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mt: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Quantity: {item.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {item.stockQuantity}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;