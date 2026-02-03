import axios from 'axios';

// Create axios instance for localhost server

const apiInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
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
