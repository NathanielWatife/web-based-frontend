import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Payment } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import { paymentService, loadPaystackScript } from '../../services/paymentService';

const CheckoutStep3 = ({ orderData, onBack, onPlaceOrder, loading }) => {
  const { getCartTotal, cartItems } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = React.useState('paystack');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const subtotal = getCartTotal();
  const shippingFee = 500;
  const total = subtotal + shippingFee;

  useEffect(() => {
    // Load Paystack script when component mounts
    if (paymentMethod === 'paystack') {
      loadPaystackScript()
        .then(() => setPaystackLoaded(true))
        .catch(error => console.error('Failed to load Paystack:', error));
    }
  }, [paymentMethod]);

  const handlePaystackPayment = async () => {
    if (!paystackLoaded) {
      alert('Payment system is loading, please try again in a moment.');
      return;
    }

    setProcessingPayment(true);
    try {
      paymentService.initializePaystackCheckout(
        total,
        user.email,
        async (response) => {
          if (response.cancelled) {
            setProcessingPayment(false);
            return;
          }

          if (response.reference) {
            // Payment was successful, place the order
            await onPlaceOrder();
          } else {
            alert('Payment failed. Please try again.');
          }
          setProcessingPayment(false);
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'paystack') {
      await handlePaystackPayment();
    } else {
      // For pay on pickup, just place the order
      await onPlaceOrder();
    }
  };

  const isProcessing = loading || processingPayment;

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Payment Method
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormLabel component="legend">Select Payment Method</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="paystack"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Pay with Paystack
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Secure online payment with card, bank transfer, or USSD
                    </Typography>
                    {!paystackLoaded && paymentMethod === 'paystack' && (
                      <Typography variant="body2" color="warning.main">
                        Loading payment system...
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ mb: 2, alignItems: 'flex-start' }}
              />
              
              <FormControlLabel
                value="onpickup"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Pay on Pickup
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pay cash when you pick up your order from campus
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start' }}
              />
            </RadioGroup>
          </FormControl>

          <Alert severity="info" sx={{ mt: 2 }}>
            {paymentMethod === 'paystack' 
              ? 'You will be redirected to Paystack to complete your payment securely.'
              : 'Your order will be prepared and you can pay when you come to pick it up from the campus bookstore.'
            }
          </Alert>

          <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Order Confirmation
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              By placing this order, you agree to our terms and conditions. 
              You will receive an email confirmation once your order is processed.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For campus pickup orders, please bring your student ID when collecting your books.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom>
              Final Total
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatPrice(subtotal)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>{formatPrice(shippingFee)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatPrice(total)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onBack}
                startIcon={<ArrowBack />}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handlePlaceOrder}
                startIcon={isProcessing ? <CircularProgress size={20} /> : <Payment />}
                disabled={isProcessing || (paymentMethod === 'paystack' && !paystackLoaded)}
                size="large"
              >
                {isProcessing ? 'Processing...' : 
                 paymentMethod === 'paystack' ? 'Pay Now' : 'Place Order'}
              </Button>
            </Box>

            {paymentMethod === 'paystack' && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src="/paystack-powered.png" 
                  alt="Powered by Paystack" 
                  style={{ height: 30, opacity: 0.7 }}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CheckoutStep3;