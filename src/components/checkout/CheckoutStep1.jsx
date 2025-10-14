import React from 'react';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Grid
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';

const CheckoutStep1 = ({ orderData, onChange, onNext }) => {
  const { getCartTotal } = useCart();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const subtotal = getCartTotal();
  const shippingFee = 500;
  const total = subtotal + shippingFee;

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Shipping & Pickup Options
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend">Select Delivery Method</FormLabel>
              <RadioGroup
                value={orderData.pickupOption}
                onChange={(e) => onChange({ pickupOption: e.target.value })}
              >
                <FormControlLabel
                  value="pickup"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Campus Pickup
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pick up your order from the campus bookstore
                      </Typography>
                      <Typography variant="body2" color="primary">
                        Free
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, alignItems: 'flex-start' }}
                />
                
                <FormControlLabel
                  value="delivery"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Home Delivery
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get your order delivered to your address
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {formatPrice(500)}
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start' }}
                />
              </RadioGroup>
            </FormControl>

            {orderData.pickupOption === 'delivery' && (
              <TextField
                fullWidth
                label="Delivery Address"
                value={orderData.deliveryAddress}
                onChange={(e) => onChange({ deliveryAddress: e.target.value })}
                margin="normal"
                required
                multiline
                rows={3}
                placeholder="Enter your complete delivery address..."
              />
            )}

            <TextField
              fullWidth
              label="Order Notes (Optional)"
              value={orderData.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              placeholder="Any special instructions for your order..."
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
              >
                Continue to Review
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CheckoutStep1;