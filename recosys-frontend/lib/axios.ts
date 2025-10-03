import axios from 'axios';
import { toast } from 'sonner'; // 1. Import the toast function

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// This interceptor runs BEFORE every request is sent to add the token
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => Promise.reject(error)
);

// This interceptor runs AFTER every response is received
API.interceptors.response.use(
  // If the response is successful, just return it
  (response) => response,
  
  // If the response has an error
  (error) => {
    // 2. Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // For 401 errors, we just want to log the user out.
      // The redirect will happen, so a toast is not needed here.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        
      }
    } else if (error.response) {
      // 3. For all other errors from the backend (400, 404, 500, etc.)
      //    we create a toast with the specific status and message.
      const status = error.response.status;
      const message = error.response.data?.message || 'An unexpected error occurred.';
      
      toast.error(`Error: ${status}`, {
        description: message,
      });
    } else {
      // Handle network errors (e.g., server is down)
      toast.error('Network Error', {
        description: 'Could not connect to the server. Please check your connection.',
      });
    }
    
    // Pass the error along so it can be caught by the component if needed
    return Promise.reject(error);
  }
);

export default API;