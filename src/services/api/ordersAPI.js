import api from './axiosConfig';

export const ordersAPI = {
  getOrders: (params = {}) => api.get('/orders/', { params }),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (orderData) => api.post('/orders/', orderData),
  updateOrder: (id, orderData) => api.patch(`/orders/${id}/`, orderData),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
  getOrderHistory: () => api.get('/orders/history/'),
};