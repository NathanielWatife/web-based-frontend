import axios from 'axios';
import NProgress from 'nprogress';
import { log } from '../utils/logger';

// Use backend URL from env only; no localhost fallback in production builds.
const rawBase = process.env.REACT_APP_API_URL;

if (!rawBase) {
  // Crash early with a clear message to avoid silent misroutes
  throw new Error(
    'REACT_APP_API_URL is not set. Please set it to the backend API base URL.'
  );
}

// Normalize to ensure a single '/api' suffix
const API_BASE_URL = (() => {
  const trimmed = rawBase.replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
})();

// Create axios instance with default configuration
const DEFAULT_TIMEOUT_MS = Number(process.env.REACT_APP_API_TIMEOUT || 50000);
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIMEOUT_MS,
  withCredentials: false,
});

let activeRequests = 0;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    log.info(`HTTP → ${config.method?.toUpperCase()} ${config.url}`);
    if (activeRequests === 0) NProgress.start();
    activeRequests += 1;
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    log.error('Request error:', error);
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) setTimeout(() => NProgress.done(), 150);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    log.info(`HTTP ← ${response.status} ${response.config.url}`);
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) setTimeout(() => NProgress.done(), 150);
    return response;
  },
  (error) => {
    log.error('Response error:', error);
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) setTimeout(() => NProgress.done(), 150);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      log.error(`API Error ${status}:`, data);
      
      if (status === 401) {
        // Unauthorized - remove token; allow caller to decide navigation
        localStorage.removeItem('token');
      } else if (status === 403) {
        // Forbidden
        log.warn('Access denied');
      } else if (status === 404) {
        // Not found
        log.warn('Resource not found');
      } else if (status >= 500) {
        // Server error
        log.error('Server error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      log.error('No response received:', error.request);
      
      if (error.code === 'ECONNABORTED') {
        log.warn('Request timeout');
      } else if (error.message === 'Network Error') {
        log.warn('Network error - please check your connection');
      }
    } else {
      // Something else happened
      log.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;