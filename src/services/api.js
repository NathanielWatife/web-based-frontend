import axios from 'axios';

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
const DEFAULT_TIMEOUT_MS = Number(process.env.REACT_APP_API_TIMEOUT || 50000); // default 50s to handle cold starts
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIMEOUT_MS,
  withCredentials: false, // Set to true if you need to send cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`Response received: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`API Error ${status}:`, data);
      
      if (status === 401) {
        // Unauthorized - remove token; allow caller to decide navigation
        localStorage.removeItem('token');
      } else if (status === 403) {
        // Forbidden
        console.error('Access denied');
      } else if (status === 404) {
        // Not found
        console.error('Resource not found');
      } else if (status >= 500) {
        // Server error
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
      } else if (error.message === 'Network Error') {
        console.error('Network error - please check your connection');
      }
    } else {
      // Something else happened
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;