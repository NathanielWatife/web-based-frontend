import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider
} from '@mui/material';
import { Visibility, Receipt } from '@mui/icons-material';
import { formatPrice } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import { Link } from 'react-router-dom';

const OrderCard = ({ order }) => {
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

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h3">
              Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Placed on {formatDate(order.createdAt)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip 
              label={order.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'} 
              color={getStatusColor(order.status)}
              size="small"
            />
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatPrice(order.totalAmount)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="body2" gutterBottom>
              <strong>Items:</strong> {order.items?.length || 0} book{order.items?.length !== 1 ? 's' : ''}
            </Typography>
            <Typography variant="body2">
              <strong>Pickup:</strong> {order.pickupOption === 'delivery' ? 'Delivery' : 'Campus Pickup'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              component={Link}
              to={`/orders/${order._id}`}
              startIcon={<Visibility />}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Receipt />}
              onClick={() => window.print()}
            >
              Receipt
            </Button>
          </Box>
        </Box>

        {/* Order Items Preview */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Items:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {order.items?.slice(0, 3).map((item, index) => (
              <Chip
                key={index}
                label={`${item.title} (x${item.quantity})`}
                size="small"
                variant="outlined"
              />
            ))}
            {order.items?.length > 3 && (
              <Chip
                label={`+${order.items.length - 3} more`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;