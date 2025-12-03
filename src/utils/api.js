// src/utils/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Attach token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: log errors, but do NOT auto-logout here
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can inspect error.response?.status here if needed
    return Promise.reject(error);
  }
);

export default api;
