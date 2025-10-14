import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import OrderCard from '../components/orders/OrderCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { orderService } from '../services/orderService';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getUserOrders();
      setOrders(ordersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status based on active tab
    if (activeTab === 1) {
      filtered = filtered.filter(order => 
        ['pending', 'confirmed', 'processing'].includes(order.status)
      );
    } else if (activeTab === 2) {
      filtered = filtered.filter(order => order.status === 'ready_for_pickup');
    } else if (activeTab === 3) {
      filtered = filtered.filter(order => 
        ['completed', 'cancelled'].includes(order.status)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getTabLabel = (status) => {
    const counts = {
      all: orders.length,
      active: orders.filter(order => ['pending', 'confirmed', 'processing'].includes(order.status)).length,
      ready: orders.filter(order => order.status === 'ready_for_pickup').length,
      completed: orders.filter(order => ['completed', 'cancelled'].includes(order.status)).length
    };

    const labels = [
      `All Orders (${counts.all})`,
      `Active (${counts.active})`,
      `Ready for Pickup (${counts.ready})`,
      `History (${counts.completed})`
    ];

    return labels[status];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View and track your book orders
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={getTabLabel(0)} />
            <Tab label={getTabLabel(1)} />
            <Tab label={getTabLabel(2)} />
            <Tab label={getTabLabel(3)} />
          </Tabs>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 3, pb: 0 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search orders by ID or book title..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TabPanel value={activeTab} index={0}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet'}
              </Typography>
            </Box>
          ) : (
            filteredOrders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No active orders
              </Typography>
            </Box>
          ) : (
            filteredOrders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No orders ready for pickup
              </Typography>
            </Box>
          ) : (
            filteredOrders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {filteredOrders.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No order history
              </Typography>
            </Box>
          ) : (
            filteredOrders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default OrderHistory;