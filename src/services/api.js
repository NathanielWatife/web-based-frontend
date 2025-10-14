import axios from 'axios';
import { getAuthToken } from '../utils/helpers';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
      throw new Error('Request timeout. Please check your connection and try again.');
    }
    
    if (!error.response) {
      console.error('Network error:', error);
      throw new Error('Network error. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;