import api from './api';

export const adminService = {
  getDashboardStats: () => {
    return api.get('/admin/dashboard');
  },

  getAllUsers: (params = {}) => {
    return api.get('/admin/users', { params });
  },

  updateUserVerification: (userId, isVerified) => {
    return api.put(`/admin/users/${userId}/verify`, { isVerified });
  }
};