import api from './axiosConfig';

export const reportsAPI = {
  getSalesReport: (params = {}) => api.get('/reports/sales/', { params }),
  getCustomerReport: (params = {}) => api.get('/reports/customers/', { params }),
  getInventoryReport: (params = {}) => api.get('/reports/inventory/', { params }),
  getRevenueReport: (params = {}) => api.get('/reports/revenue/', { params }),
  getDashboardStats: () => api.get('/reports/dashboard-stats/'),
  exportReport: (reportType, format) => api.get(`/reports/export/${reportType}/`, { 
    params: { format },
    responseType: 'blob'
  }),
};