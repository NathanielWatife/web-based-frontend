import api from './api';

export const orderService = {
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  getMyOrders: () => {
    return api.get('/orders/my-orders');
  },

  getOrder: (id) => {
    return api.get(`/orders/${id}`);
  },

  cancelOrder: (id) => {
    return api.put(`/orders/${id}/cancel`);
  },

  updateOrderStatus: (id, status) => {
    return api.put(`/admin/orders/${id}/status`, { status });
  }
};