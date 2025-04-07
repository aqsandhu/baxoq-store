import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't handle auth errors for login/register endpoints
    const isAuthEndpoint = 
      error.config.url?.includes('/users/login') || 
      error.config.url?.includes('/users/register');
    
    // Don't automatically redirect for admin product endpoints
    const isProductEndpoint = error.config.url?.includes('/products');

    // Only handle auth errors for non-auth endpoints
    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      console.error('Authentication error:', error.response.data);
      
      // Only log the error but don't automatically redirect or remove tokens
      // Let the calling function handle the redirect
      if (!isProductEndpoint) {
        console.log('Authentication error in non-product endpoint');
        // The individual service methods should handle token removal and redirects
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
