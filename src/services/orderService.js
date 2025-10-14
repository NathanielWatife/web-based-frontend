import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getUserOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async getAllOrders(params = {}) {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.put(`/admin/orders/${id}`, { status });
    return response.data;
  }
};