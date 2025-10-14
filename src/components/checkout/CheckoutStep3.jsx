import React from 'react';
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
  Alert
} from '@mui/material';
import { ArrowBack, Payment } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const CheckoutStep3 = ({ orderData, onBack, onPlaceOrder, loading }) => {
  const { getCartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = React.useState('paystack');

  const subtotal = getCartTotal();
  const shippingFee = 500;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    onPlaceOrder();
  };

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
                disabled={loading}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handlePlaceOrder}
                startIcon={<Payment />}
                disabled={loading}
                size="large"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CheckoutStep3;