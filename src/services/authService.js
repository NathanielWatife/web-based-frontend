import api from './api';

export const authService = {
  login: (matricNo, password) => {
    return api.post('/auth/login', { matricNo, password });
  },

  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  verifyToken: (token) => {
    return api.get('/auth/verify-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  adminLogin: (email, password) => {
    return api.post('/auth/admin/login', { email, password });
  },
  verifyEmail : (matricNo, verificationCode) => {
    return api.post('/auth/verify-email', { matricNo, verificationCode });
  },
  resendVerification: (matricNo) => {
    return api.post('/auth/resend-verification', { matricNo });
  }
};