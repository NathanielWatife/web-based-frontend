import api from './api';

export const adminService = {
  getDashboardStats: () => {
    return api.get('/admin/dashboard');
  },

  getAllUsers: (params = {}) => {
    return api.get('/admin/users', { params });
  },

  // Orders (admin)
  getAllOrders: (params = {}) => {
    return api.get('/admin/orders', { params });
  },

  updateOrderStatus: (orderId, status) => {
    return api.put(`/admin/orders/${orderId}/status`, { status });
  }
};