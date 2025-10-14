import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Alert
} from '@mui/material';
import { ArrowBack, Receipt } from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import OrderDetails from '../components/orders/OrderDetails';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { orderService } from '../services/orderService';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Message from Order Placement */}
      {location.state?.message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {location.state.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          variant="outlined"
        >
          Back to Orders
        </Button>

        <Button
          startIcon={<Receipt />}
          onClick={() => window.print()}
          variant="contained"
        >
          Print Receipt
        </Button>
      </Box>

      {error ? (
        <Alert severity="error">
          {error}
        </Alert>
      ) : (
        <OrderDetails order={order} />
      )}
    </Container>
  );
};

export default OrderDetailsPage;