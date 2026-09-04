import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // Crucial for Sanctum cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// For Fortify routes, which are not under /api by default
export const webApi = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;
