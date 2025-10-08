import api from './api';

export const ordersAPI = {
  getUserOrders: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await api.put(`/orders/${id}/status/`, statusData);
    return response.data;
  },

  getAdminOrders: async () => {
    const response = await api.get('/orders/admin/');
    return response.data;
  }
};