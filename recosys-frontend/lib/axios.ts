import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

/**
 * Request Interceptor
 * This runs BEFORE every API request is sent.
 * Its job is to grab the token from localStorage and add it to the Authorization header.
 */
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * This runs AFTER every API response is received.
 * Its job is to check for a 401 Unauthorized error, which means the token is
 * invalid or expired. If it finds one, it automatically logs the user out.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login'; // Force a full redirect to clear all state
      }
    }
    return Promise.reject(error);
  }
);

export default API;