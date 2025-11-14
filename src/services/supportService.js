import api from './api';

export const supportService = {
  listTickets: (params = {}) => api.get('/support', { params }),
  getMyTickets: () => api.get('/support/my'),
  getTicket: (id) => api.get(`/support/${id}`),
  updateStatus: (id, status) => api.put(`/support/${id}/status`, { status }),
  reply: (id, text) => api.post(`/support/${id}/reply`, { text }),
};
