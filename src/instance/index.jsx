import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Create axios instance - uses VITE_API_URL from .env (or fallback)
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle FormData
apiInstance.interceptors.request.use((config) => {
  // If the data is FormData, remove the Content-Type header
  // to let the browser set it with the correct boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});





export default apiInstance;
