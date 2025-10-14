import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid
} from '@mui/material';
import { formatPrice } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const OrderDetails = ({ order }) => {
  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: 'warning',
      [ORDER_STATUS.CONFIRMED]: 'info',
      [ORDER_STATUS.PROCESSING]: 'primary',
      [ORDER_STATUS.READY_FOR_PICKUP]: 'success',
      [ORDER_STATUS.COMPLETED]: 'success',
      [ORDER_STATUS.CANCELLED]: 'error'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Order not found</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      {/* Order Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Placed on {formatDate(order.createdAt)}
          </Typography>
          {order.updatedAt && order.updatedAt !== order.createdAt && (
            <Typography variant="body2" color="text.secondary">
              Last updated: {formatDate(order.updatedAt)}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Chip 
            label={order.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'} 
            color={getStatusColor(order.status)}
            size="medium"
          />
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatPrice(order.totalAmount)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={item.imageUrl || '/placeholder-book.jpg'}
                          alt={item.title}
                          sx={{ width: 50, height: 60, objectFit: 'cover' }}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            by {item.author}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ISBN: {item.isbn}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell align="center">
                      {item.quantity}
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatPrice(order.totalAmount - 500)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>{formatPrice(500)}</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatPrice(order.totalAmount)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Pickup Information
              </Typography>
              <Typography variant="body2">
                <strong>Method:</strong> {order.pickupOption === 'delivery' ? 'Delivery' : 'Campus Pickup'}
              </Typography>
              {order.pickupOption === 'delivery' && order.deliveryAddress && (
                <Typography variant="body2">
                  <strong>Address:</strong> {order.deliveryAddress}
                </Typography>
              )}
            </Box>

            {order.notes && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Order Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.notes}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderDetails;