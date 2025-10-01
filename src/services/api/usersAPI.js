import api from './axiosConfig';

export const usersAPI = {
  getUsers: (params = {}) => api.get('/users/', { params }),
  getUser: (id) => api.get(`/users/${id}/`),
  createUser: (userData) => api.post('/users/', userData),
  updateUser: (id, userData) => api.patch(`/users/${id}/`, userData),
  deleteUser: (id) => api.delete(`/users/${id}/`),
  toggleUserStatus: (id, isActive) => api.patch(`/users/${id}/status/`, { is_active: isActive }),
  getUserStats: () => api.get('/users/stats/'),
};