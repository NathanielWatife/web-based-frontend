import api from './axiosConfig';

export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    verifyToken: () => api.get('/auth/verify/'),
    logout: () => api.post('/auth/logout/'),
    requestPasswordReset: (email) => api.post('/auth/password/reset/', { email }),
    resetPassword: (data) => api.post('/auth/password/reset/confirm/', data),
};