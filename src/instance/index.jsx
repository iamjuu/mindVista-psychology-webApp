import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getPatientToken } from '../constants/patientAuthStorage';

// Create axios instance - uses VITE_API_URL from .env (or fallback)
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle FormData + patient JWT
apiInstance.interceptors.request.use((config) => {
  const token = getPatientToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If the data is FormData, remove the Content-Type header
  // to let the browser set it with the correct boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});





export default apiInstance;
