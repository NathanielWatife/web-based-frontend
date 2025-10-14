import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Alert
} from '@mui/material';
import { ShoppingCart, ArrowForward } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const CartSummary = ({ onCheckout }) => {
  const { cartItems, getCartTotal, getCartItemsCount } = useCart();
  const { isAuthenticated } = useAuth();

  const totalItems = getCartItemsCount();
  const subtotal = getCartTotal();
  const shippingFee = subtotal > 0 ? 500 : 0; // Flat shipping fee
  const total = subtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Add some books to get started!
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/books"
          sx={{ mt: 2 }}
        >
          Browse Books
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Items ({totalItems}):</Typography>
          <Typography>{formatPrice(subtotal)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Shipping:</Typography>
          <Typography>{formatPrice(shippingFee)}</Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Total:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {formatPrice(total)}
          </Typography>
        </Box>
      </Box>

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please login to proceed with checkout
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        endIcon={<ArrowForward />}
        onClick={onCheckout}
        disabled={!isAuthenticated || cartItems.length === 0}
      >
        Proceed to Checkout
      </Button>

      <Button
        fullWidth
        variant="outlined"
        component={Link}
        to="/books"
        sx={{ mt: 1 }}
      >
        Continue Shopping
      </Button>
    </Paper>
  );
};

export default CartSummary;