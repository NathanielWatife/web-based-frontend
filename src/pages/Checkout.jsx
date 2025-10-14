import React, { useState } from 'react';
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  Button,
  Grid,
  Alert
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

// Checkout Steps Components
import CheckoutStep1 from '../components/checkout/CheckoutStep1';
import CheckoutStep2 from '../components/checkout/CheckoutStep2';
import CheckoutStep3 from '../components/checkout/CheckoutStep3';

const steps = ['Shipping & Pickup', 'Review Order', 'Payment'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    pickupOption: 'pickup',
    deliveryAddress: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleOrderDataChange = (newData) => {
    setOrderData(prev => ({ ...prev, ...newData }));
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const orderPayload = {
        items: cartItems.map(item => ({
          book: item._id,
          title: item.title,
          author: item.author,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        totalAmount: getCartTotal() + 500, // Add shipping fee
        pickupOption: orderData.pickupOption,
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes
      };

      const order = await orderService.createOrder(orderPayload);
      
      // Clear cart and redirect to order confirmation
      clearCart();
      navigate(`/orders/${order._id}`, { 
        state: { 
          message: 'Order placed successfully!',
          order 
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <CheckoutStep1
            orderData={orderData}
            onChange={handleOrderDataChange}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <CheckoutStep2
            orderData={orderData}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <CheckoutStep3
            orderData={orderData}
            onBack={handleBack}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Your cart is empty
        </Alert>
        <Button variant="contained" onClick={() => navigate('/books')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        {getStepContent(activeStep)}
      </Box>
    </Container>
  );
};

export default Checkout;