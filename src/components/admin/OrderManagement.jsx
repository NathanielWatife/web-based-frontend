import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import {
  MoreVert,
  Visibility
} from '@mui/icons-material';
import { formatPrice } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import { orderService } from '../../services/orderService';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getAllOrders();
      setOrders(ordersData.orders || ordersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return;

    try {
      await orderService.updateOrderStatus(selectedOrder._id, newStatus);
      await fetchOrders();
      handleMenuClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

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
    return new Date(dateString).toLocaleDateString('en-NG');
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.READY_FOR_PICKUP,
      ORDER_STATUS.COMPLETED,
      ORDER_STATUS.CANCELLED
    ];

    return allStatuses.filter(status => status !== currentStatus);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage and track all customer orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pickup</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {order.user?.fullName || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.user?.matricNo || 'N/A'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.pickupOption === 'delivery' ? 'Delivery' : 'Pickup'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    component={Link}
                    to={`/admin/orders/${order._id}`}
                    color="primary"
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, order)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Update Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">
            Update Status
          </Typography>
        </MenuItem>
        {selectedOrder && getStatusOptions(selectedOrder.status).map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusUpdate(status)}
          >
            {status.replace('_', ' ').toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default OrderManagement;