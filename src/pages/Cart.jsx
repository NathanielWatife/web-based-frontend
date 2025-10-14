import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ShoppingCart sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Shopping Cart
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <CartSummary onCheckout={handleCheckout} />
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cart Items ({cartItems.length})
              </Typography>
              
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </Paper>
          </Grid>

          {/* Cart Summary */}
          <Grid item xs={12} md={4}>
            <CartSummary onCheckout={handleCheckout} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;