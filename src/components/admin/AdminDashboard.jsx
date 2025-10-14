import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper
} from '@mui/material';
import {
  People,
  LibraryBooks,
  ShoppingCart,
  TrendingUp,
  AttachMoney,
  Inventory
} from '@mui/icons-material';
import { formatPrice } from '../../utils/helpers';

const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color: `${color}.main`, fontSize: 48 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchStats = async () => {
      try {
        // Mock data for demonstration
        setStats({
          totalUsers: 1247,
          totalBooks: 356,
          totalOrders: 892,
          totalRevenue: 2856400,
          pendingOrders: 23,
          lowStockBooks: 12
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your admin dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            subtitle="Registered students"
            icon={<People />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Books"
            value={stats.totalBooks.toLocaleString()}
            subtitle="In inventory"
            icon={<LibraryBooks />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            subtitle="All time"
            icon={<ShoppingCart />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Revenue"
            value={formatPrice(stats.totalRevenue)}
            subtitle="Gross income"
            icon={<AttachMoney />}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            subtitle="Need processing"
            icon={<TrendingUp />}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Low Stock"
            value={stats.lowStockBooks}
            subtitle="Books to restock"
            icon={<Inventory />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Recent orders list will be implemented here
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alerts
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Low stock alerts will be shown here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;